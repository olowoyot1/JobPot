'use server';

import { sendEmail } from '../lib/email';
import { getSettings } from '../lib/settings';

export async function sendContactMessage(formData) {
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const message = String(formData.get('message') || '').trim();

  if (!name || !email || !message) {
    return { error: 'Please fill in your name, email, and message.' };
  }

  const settings = await getSettings();
  const to = settings.contactEmail;
  if (!to) {
    return { error: 'This site has no contact email configured yet.' };
  }

  const notifyResult = await sendEmail({
    to,
    replyTo: email,
    subject: `New contact form message from ${name}`,
    html: `
      <p><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>
    `,
  });

  if (notifyResult.error) {
    return { error: notifyResult.error };
  }

  // Best-effort confirmation to the sender — don't fail the whole action if this part fails.
  await sendEmail({
    to: email,
    subject: `We received your message — ${settings.siteName}`,
    html: `
      <p>Hi ${escapeHtml(name)},</p>
      <p>Thanks for reaching out to ${escapeHtml(settings.siteName)}. We've received your message and will get back to you shortly.</p>
      <p style="color:#666">— This is an automated confirmation, no need to reply to this email.</p>
    `,
  });

  return { success: true };
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
