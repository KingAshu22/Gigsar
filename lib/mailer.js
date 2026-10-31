import nodemailer from "nodemailer";

// Sends mail through a Gmail / Google Workspace account using an App Password.
// Required env vars: GMAIL_USER, GMAIL_APP_PASSWORD
// Optional: MAIL_FROM (defaults to GMAIL_USER; must be that account or a verified
// "Send mail as" alias), MAIL_FROM_NAME (defaults to "Gigsar")
let transporter;

function getTransporter() {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error("GMAIL_USER and GMAIL_APP_PASSWORD must be set to send email");
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }
  return transporter;
}

export async function sendMail({ to, subject, html, text, replyTo, bcc }) {
  return getTransporter().sendMail({
    from: `"${process.env.MAIL_FROM_NAME || "Gigsar"}" <${process.env.MAIL_FROM || process.env.GMAIL_USER}>`,
    to,
    bcc,
    replyTo,
    subject,
    html,
    text,
  });
}
