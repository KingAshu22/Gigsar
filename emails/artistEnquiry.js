import { phoneDigits } from "@/lib/contactVisibility";

// Plain HTML with inline styles and tables, so it renders the same in Gmail,
// Outlook and Apple Mail.

const BRAND = "#dc2626";
const DARK = "#111827";
const MUTED = "#6b7280";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// `value` is already-escaped HTML.
function row(icon, label, value) {
  if (!value) return "";
  return `
    <tr>
      <td width="36" style="padding:12px 0;vertical-align:top;border-bottom:1px solid #f3f4f6;font-size:18px;line-height:20px;">${icon}</td>
      <td style="padding:12px 0;vertical-align:top;border-bottom:1px solid #f3f4f6;">
        <div style="font-size:12px;color:${MUTED};text-transform:uppercase;letter-spacing:0.6px;margin-bottom:3px;">${escapeHtml(label)}</div>
        <div style="font-size:15px;color:${DARK};font-weight:600;line-height:1.4;">${value}</div>
      </td>
    </tr>`;
}

function card(title, rows) {
  if (!rows) return "";
  return `
    <tr><td style="padding:20px 32px 0;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e5e7eb;border-radius:12px;">
        <tr><td style="padding:16px 20px 4px;">
          <div style="font-size:13px;font-weight:700;color:${BRAND};text-transform:uppercase;letter-spacing:1px;">${escapeHtml(title)}</div>
        </td></tr>
        <tr><td style="padding:0 20px 8px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${rows}</table>
        </td></tr>
      </table>
    </td></tr>`;
}

function button(href, label, bg) {
  return `<a href="${href}" style="display:inline-block;margin:4px;padding:12px 22px;background:${bg};color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:700;">${label}</a>`;
}

function receivedAt() {
  return new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

// Builds the email sent to an artist when a client submits an enquiry on Gigsar.
export function artistEnquiryEmail({ artistName, enquiry, siteUrl, premium = false }) {
  const { name, email, contact, eventType, eventDate, location, address, budget } =
    enquiry;

  const digits = phoneDigits(contact);
  const safeEmail = escapeHtml(email);
  const linkStyle = `color:${DARK};text-decoration:none;`;

  const eventRows =
    row("&#127881;", "Event Type", escapeHtml(eventType)) +
    row("&#128197;", "Event Date", escapeHtml(eventDate)) +
    row("&#128205;", "Event City", escapeHtml(location)) +
    row("&#127968;", "Venue / Address", escapeHtml(address)) +
    row("&#128176;", "Budget", budget ? `&#8377; ${escapeHtml(budget)}` : "");

  const clientRows =
    row("&#128100;", "Name", escapeHtml(name)) +
    row(
      "&#128222;",
      "Phone",
      digits ? `<a href="tel:+${digits}" style="${linkStyle}">+${digits}</a>` : ""
    ) +
    row(
      "&#9993;&#65039;",
      "Email",
      email ? `<a href="mailto:${safeEmail}" style="${linkStyle}">${safeEmail}</a>` : ""
    );

  const buttons = [
    digits && button(`tel:+${digits}`, "Call Client", DARK),
    digits && button(`https://wa.me/${digits}`, "WhatsApp Client", "#16a34a"),
    email && button(`mailto:${safeEmail}`, "Reply by Email", BRAND),
  ]
    .filter(Boolean)
    .join("");

  const badge = premium
    ? `<span style="display:inline-block;padding:4px 10px;background:#fef3c7;color:#92400e;border-radius:999px;font-size:12px;font-weight:700;">&#11088; PREMIUM ENQUIRY</span>`
    : `<span style="display:inline-block;padding:4px 10px;background:#ffffff;color:${BRAND};border-radius:999px;font-size:12px;font-weight:700;">NEW ENQUIRY</span>`;

  const headline = [eventType, eventDate, location].filter(Boolean).map(escapeHtml);
  const preheader = `New enquiry from ${name || "a client"}${
    eventType ? ` for ${eventType}` : ""
  }${eventDate ? ` on ${eventDate}` : ""}`;

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>New Booking Enquiry</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,Helvetica,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f4f5;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

        <tr><td style="background:${BRAND};background-image:linear-gradient(135deg,#FA5252,#DD2476);padding:32px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr>
            <td style="font-size:26px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">Gigsar</td>
            <td align="right">${badge}</td>
          </tr></table>
          <div style="margin-top:24px;font-size:24px;font-weight:700;color:#ffffff;line-height:1.3;">You have a new booking enquiry!</div>
          ${
            headline.length
              ? `<div style="margin-top:8px;font-size:15px;color:#ffe4e6;">${headline.join(" &nbsp;&bull;&nbsp; ")}</div>`
              : ""
          }
        </td></tr>

        <tr><td style="padding:28px 32px 0;">
          <p style="margin:0 0 12px;font-size:16px;color:${DARK};">Hi ${escapeHtml(artistName || "there")},</p>
          <p style="margin:0;font-size:15px;line-height:1.6;color:#374151;">
            ${escapeHtml(name || "A client")} wants to book you through your Gigsar profile.
            Here are the details. Clients usually book the artist who replies first, so get in touch soon.
          </p>
        </td></tr>

        ${card("Event Details", eventRows)}
        ${card("Client Details", clientRows)}

        ${
          buttons
            ? `<tr><td align="center" style="padding:24px 24px 0;">${buttons}</td></tr>`
            : ""
        }

        <tr><td style="padding:24px 32px 0;">
          <p style="margin:0;font-size:12px;color:${MUTED};text-align:center;">Received on ${receivedAt()} IST</p>
        </td></tr>

        <tr><td style="padding:24px 32px 28px;">
          <p style="margin:0;padding-top:20px;border-top:1px solid #f3f4f6;font-size:13px;line-height:1.6;color:${MUTED};">
            You are receiving this email because you are listed as an artist on
            <a href="${escapeHtml(siteUrl)}" style="color:${BRAND};text-decoration:none;font-weight:600;">Gigsar</a>.
            ${email ? "Replying to this email will reach the client directly." : ""}
            Need help? Write to <a href="mailto:support@gigsar.com" style="color:${BRAND};text-decoration:none;">support@gigsar.com</a>.
          </p>
        </td></tr>

        <tr><td style="background:${DARK};padding:18px 32px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">&copy; ${new Date().getFullYear()} Gigsar. All rights reserved.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  // null lines are dropped; "" lines are kept as spacing
  const field = (label, value) => (value ? `${label}: ${value}` : null);
  const text = [
    `Hi ${artistName || "there"},`,
    "",
    `You have a new ${premium ? "premium " : ""}booking enquiry on Gigsar.`,
    "",
    "EVENT DETAILS",
    field("Event Type", eventType),
    field("Event Date", eventDate),
    field("Event City", location),
    field("Venue / Address", address),
    field("Budget", budget && `Rs. ${budget}`),
    "",
    "CLIENT DETAILS",
    field("Name", name),
    field("Phone", digits && `+${digits}`),
    field("Email", email),
    "",
    `Received on ${receivedAt()} IST`,
    "",
    "- Team Gigsar (support@gigsar.com)",
  ]
    .filter((line) => line !== null)
    .join("\n");

  const subject = `${premium ? "⭐ Premium" : "New"} Booking Enquiry${
    eventType ? ` - ${eventType}` : ""
  }${eventDate ? ` on ${eventDate}` : ""} | Gigsar`;

  return { subject, html, text };
}
