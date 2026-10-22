import crypto from "crypto";
import { NextResponse } from "next/server";
import { connectToDB } from "@/app/_utils/mongodb";
import Artist from "@/models/Artist";
import EnquiryEmail from "@/models/EnquiryEmail";
import { sendMail } from "@/lib/mailer";
import { artistEnquiryEmail } from "@/emails/artistEnquiry";

export const runtime = "nodejs";

function clean(value, max = 200) {
  return String(value ?? "").trim().slice(0, max);
}

// Only a genuine, verified Razorpay payment can trigger an email, so this
// endpoint cannot be used to spam artists.
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

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const { orderId, razorpayPaymentId, razorpaySignature } = body;

  if (!isValidPayment(orderId, razorpayPaymentId, razorpaySignature)) {
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

  await connectToDB();

  const artist = await Artist.findOne({ linkid: clean(body.linkid, 150) }).lean();
  if (!artist) {
    return NextResponse.json({ sent: false, error: "Artist not found" }, { status: 404 });
  }
  if (!artist.email) {
    return NextResponse.json({ sent: false, reason: "Artist has no email" });
  }

  let record;
  try {
    record = await EnquiryEmail.create({
      orderId,
      paymentId: razorpayPaymentId,
      linkid: artist.linkid,
      artistEmail: artist.email,
      clientName: enquiry.name,
      clientEmail: enquiry.email,
      clientContact: enquiry.contact,
      eventType: enquiry.eventType,
      eventDate: enquiry.eventDate,
      location: enquiry.location,
      budget: enquiry.budget,
    });
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
