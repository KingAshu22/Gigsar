import { phoneDigits } from "@/lib/contactVisibility";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label, value) {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:10px 0;color:#6b7280;font-size:14px;width:40%;vertical-align:top;border-bottom:1px solid #f1f1f1;">${escapeHtml(label)}</td>
      <td style="padding:10px 0;color:#111827;font-size:14px;font-weight:600;vertical-align:top;border-bottom:1px solid #f1f1f1;">${value}</td>
    </tr>`;
}

function section(title, rows) {
  return `
    <tr><td style="padding:24px 32px 0;">
      <h2 style="margin:0 0 8px;font-size:16px;color:#dc2626;text-transform:uppercase;letter-spacing:0.5px;">${escapeHtml(title)}</h2>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${rows}</table>
    </td></tr>`;
}

// Builds the email sent to an artist when a client submits an enquiry on Gigsar.
export function artistEnquiryEmail({ artistName, enquiry, siteUrl }) {
  const {
    name,
    email,
    contact,
    eventType,
    eventDate,
    location,
    address,
    budget,
  } = enquiry;

  const digits = phoneDigits(contact);
  const contactHtml = digits
    ? `<a href="tel:+${digits}" style="color:#111827;text-decoration:none;">+${escapeHtml(digits)}</a>`
    : "";
  const emailHtml = email
    ? `<a href="mailto:${escapeHtml(email)}" style="color:#111827;text-decoration:none;">${escapeHtml(email)}</a>`
    : "";

  const eventRows =
    row("Event Type", escapeHtml(eventType)) +
    row("Event Date", escapeHtml(eventDate)) +
    row("Event City", escapeHtml(location)) +
    row("Venue / Address", escapeHtml(address)) +
    row("Budget", budget ? `&#8377; ${escapeHtml(budget)}` : "");

  const clientRows =
    row("Name", escapeHtml(name)) +
    row("Phone", contactHtml) +
    row("Email", emailHtml);

  const buttons = [
    digits &&
      `<a href="tel:+${digits}" style="display:inline-block;margin:4px;padding:12px 20px;background:#111827;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">Call Client</a>`,
    digits &&
      `<a href="https://wa.me/${digits}" style="display:inline-block;margin:4px;padding:12px 20px;background:#25D366;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">WhatsApp Client</a>`,
    email &&
      `<a href="mailto:${escapeHtml(email)}" style="display:inline-block;margin:4px;padding:12px 20px;background:#dc2626;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">Reply by Email</a>`,
  ]
    .filter(Boolean)
    .join("");

  const html = `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f4f5;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;">
        <tr><td style="background:linear-gradient(90deg,#FA5252,#DD2476);background-color:#dc2626;padding:28px 32px;">
          <h1 style="margin:0;color:#ffffff;font-size:24px;">Gigsar</h1>
          <p style="margin:6px 0 0;color:#ffe4e6;font-size:14px;">New booking enquiry</p>
        </td></tr>
        <tr><td style="padding:28px 32px 0;">
          <p style="margin:0 0 12px;font-size:16px;color:#111827;">Hi ${escapeHtml(artistName || "there")},</p>
          <p style="margin:0;font-size:15px;line-height:1.6;color:#374151;">
            Good news! A client has sent you a booking enquiry through your Gigsar profile.
            The event and client details are below. Please get in touch with them soon.
          </p>
        </td></tr>
        ${section("Event Details", eventRows)}
        ${section("Client Details", clientRows)}
        ${buttons ? `<tr><td align="center" style="padding:28px 32px 0;">${buttons}</td></tr>` : ""}
        <tr><td style="padding:28px 32px;">
          <p style="margin:0;font-size:13px;line-height:1.6;color:#6b7280;">
            You are receiving this email because you are listed as an artist on
            <a href="${escapeHtml(siteUrl)}" style="color:#dc2626;">Gigsar</a>.
            Replying to this email will reach the client directly.
          </p>
        </td></tr>
        <tr><td style="background:#111827;padding:16px 32px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">&copy; ${new Date().getFullYear()} Gigsar. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = [
    `Hi ${artistName || "there"},`,
    "",
    "You have a new booking enquiry on Gigsar.",
    "",
    "EVENT DETAILS",
    eventType && `Event Type: ${eventType}`,
    eventDate && `Event Date: ${eventDate}`,
    location && `Event City: ${location}`,
    address && `Venue / Address: ${address}`,
    budget && `Budget: Rs. ${budget}`,
    "",
    "CLIENT DETAILS",
    name && `Name: ${name}`,
    digits && `Phone: +${digits}`,
    email && `Email: ${email}`,
    "",
    "- Team Gigsar",
  ]
    .filter((line) => typeof line === "string")
    .join("\n");

  const subject = `New Booking Enquiry${eventType ? ` - ${eventType}` : ""}${
    eventDate ? ` on ${eventDate}` : ""
  } | Gigsar`;

  return { subject, html, text };
}
