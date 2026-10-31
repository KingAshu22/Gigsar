import crypto from "crypto";
import { NextResponse } from "next/server";
import { connectToDB } from "@/app/_utils/mongodb";
import Artist from "@/models/Artist";
import EnquiryEmail from "@/models/EnquiryEmail";
import { sendMail } from "@/lib/mailer";
import { artistEnquiryEmail } from "@/emails/artistEnquiry";

export const runtime = "nodejs";

// Limits for free enquiries (paid ones are already protected by the payment).
const DAY_MS = 24 * 60 * 60 * 1000;
const FREE_PER_CONTACT_PER_DAY = 10;
const FREE_PER_IP_PER_DAY = 20;

function clean(value, max = 200) {
  return String(value ?? "").trim().slice(0, max);
}

function isValidPayment(orderId, paymentId, signature) {
  if (!orderId || !paymentId || !signature || !process.env.RAZORPAY_KEY_SECRET) {
    return false;
  }
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(String(signature));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function getIp(req) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    ""
  );
}

// Returns an error response if this free enquiry should not be emailed, otherwise null.
async function checkFreeLimits({ linkid, enquiry, ip }) {
  const since = new Date(Date.now() - DAY_MS);

  const duplicate = await EnquiryEmail.exists({
    kind: "free",
    linkid,
    clientContact: enquiry.contact,
    eventDate: enquiry.eventDate,
    status: { $ne: "failed" },
    createdAt: { $gte: since },
  });
  if (duplicate) {
    return NextResponse.json({ sent: false, reason: "Already sent" });
  }

  const [byContact, byIp] = await Promise.all([
    EnquiryEmail.countDocuments({
      kind: "free",
      clientContact: enquiry.contact,
      createdAt: { $gte: since },
    }),
    ip
      ? EnquiryEmail.countDocuments({ kind: "free", ip, createdAt: { $gte: since } })
      : 0,
  ]);
  if (byContact >= FREE_PER_CONTACT_PER_DAY || byIp >= FREE_PER_IP_PER_DAY) {
    return NextResponse.json(
      { sent: false, error: "Too many enquiries. Please try again later." },
      { status: 429 }
    );
  }
  return null;
}

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const { orderId, razorpayPaymentId, razorpaySignature } = body;
  const paid = Boolean(orderId || razorpayPaymentId || razorpaySignature);

  // A paid enquiry must carry a genuine Razorpay payment.
  if (paid && !isValidPayment(orderId, razorpayPaymentId, razorpaySignature)) {
    return NextResponse.json({ sent: false, error: "Invalid payment" }, { status: 400 });
  }

  const enquiry = {
    name: clean(body.name, 100),
    email: clean(body.email, 150),
    contact: clean(body.contact, 20),
    eventType: clean(body.eventType, 100),
    eventDate: clean(body.eventDate, 50),
    location: clean(body.location),
    address: clean([body.address, body.zipCode].filter(Boolean).join(" ")),
    budget: clean(body.budget, 30),
  };
  const linkid = clean(body.linkid, 150);

  if (!paid && (!enquiry.contact || !linkid)) {
    return NextResponse.json({ sent: false, error: "Missing details" }, { status: 400 });
  }

  await connectToDB();

  const artist = await Artist.findOne({ linkid }).lean();
  if (!artist) {
    return NextResponse.json({ sent: false, error: "Artist not found" }, { status: 404 });
  }
  if (!artist.email) {
    return NextResponse.json({ sent: false, reason: "Artist has no email" });
  }

  const ip = getIp(req);
  if (!paid) {
    const blocked = await checkFreeLimits({ linkid: artist.linkid, enquiry, ip });
    if (blocked) return blocked;
  }

  const recordData = {
    // Free enquiries get a generated id so the unique orderId index still works.
    orderId: paid ? orderId : `free_${crypto.randomUUID()}`,
    paymentId: razorpayPaymentId,
    kind: paid ? "paid" : "free",
    ip,
    linkid: artist.linkid,
    artistEmail: artist.email,
    clientName: enquiry.name,
    clientEmail: enquiry.email,
    clientContact: enquiry.contact,
    eventType: enquiry.eventType,
    eventDate: enquiry.eventDate,
    location: enquiry.location,
    budget: enquiry.budget,
  };

  let record;
  try {
    record = await EnquiryEmail.create(recordData);
  } catch (error) {
    if (error.code !== 11000) throw error;
    // Same payment seen before: only retry if the earlier attempt failed
    record = await EnquiryEmail.findOne({ orderId });
    if (record?.status !== "failed") {
      return NextResponse.json({ sent: false, reason: "Already sent" });
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gigsar.com";
  const { subject, html, text } = artistEnquiryEmail({
    artistName: artist.name,
    enquiry,
    siteUrl,
    premium: paid,
  });

  try {
    await sendMail({
      to: artist.email,
      bcc: process.env.ENQUIRY_BCC_EMAIL || undefined,
      replyTo: enquiry.email || undefined,
      subject,
      html,
      text,
    });
    record.status = "sent";
    await record.save();
    return NextResponse.json({ sent: true });
  } catch (error) {
    console.error("Error sending artist enquiry email:", error);
    record.status = "failed";
    record.error = error.message;
    await record.save();
    return NextResponse.json({ sent: false, error: "Failed to send email" }, { status: 502 });
  }
}
