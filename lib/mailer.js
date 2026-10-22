import nodemailer from "nodemailer";

// Sends mail through a Gmail / Google Workspace account using an App Password.
// Required env vars: GMAIL_USER, GMAIL_APP_PASSWORD
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
    from: `"${process.env.MAIL_FROM_NAME || "Gigsar"}" <${process.env.GMAIL_USER}>`,
    to,
    bcc,
    replyTo,
    subject,
    html,
    text,
  });
}
