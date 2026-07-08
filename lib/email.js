const nodemailer = require('nodemailer');

let cachedTransporter = null;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) return null;

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for port 465 (SSL), false for 587 (STARTTLS)
    auth: { user, pass },
  });

  return cachedTransporter;
}

async function sendEmail({ to, replyTo, subject, html }) {
  const transporter = getTransporter();
  if (!transporter) {
    return { error: 'Email is not configured yet. Set SMTP_HOST, SMTP_USER, and SMTP_PASSWORD to enable this.' };
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  try {
    await transporter.sendMail({ from, to, replyTo, subject, html });
    return { success: true };
  } catch (err) {
    return { error: `Email failed to send: ${err.message || 'unknown error'}` };
  }
}

module.exports = { sendEmail };
