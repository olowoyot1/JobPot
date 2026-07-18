'use server';

import { headers } from 'next/headers';
import { put } from '@vercel/blob';
import { prisma } from '../lib/db';
import { sendEmail } from '../lib/email';
import { getSettings } from '../lib/settings';

export async function submitCvForm(formData) {
  const name = String(formData.get('name') || '').trim();
  if (!name) {
    return { error: 'Please add a name before submitting.' };
  }

  const role = String(formData.get('role') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const phone = String(formData.get('phone') || '').trim();
  const location = String(formData.get('location') || '').trim();
  const summary = String(formData.get('summary') || '').trim();
  const skills = String(formData.get('skills') || '').trim();
  const languages = String(formData.get('languages') || '').trim();
  const dob = String(formData.get('dob') || '').trim();
  const nationality = String(formData.get('nationality') || '').trim();
  const marital = String(formData.get('marital') || '').trim();
  const visa = String(formData.get('visa') || '').trim();
  const objective = String(formData.get('objective') || '').trim();
  const format = String(formData.get('format') || 'uk');
  const includePhoto = String(formData.get('includePhoto') || '') === 'true';

  let experience = [];
  let education = [];
  try {
    experience = JSON.parse(String(formData.get('experience') || '[]'));
  } catch {
    experience = [];
  }
  try {
    education = JSON.parse(String(formData.get('education') || '[]'));
  } catch {
    education = [];
  }

  let photoUrl = null;
  const photo = formData.get('photo');
  if (photo && typeof photo !== 'string' && photo.size > 0) {
    try {
      const blob = await put(`cv-submissions/${Date.now()}-${photo.name || 'photo.jpg'}`, photo, {
        access: 'private',
      });
      photoUrl = blob.pathname;
    } catch {
      // Non-fatal — the CV still saves without the photo rather than blocking submission.
    }
  }

  const submission = await prisma.cvSubmission.create({
    data: {
      name,
      role,
      email,
      phone,
      location,
      summary,
      skills,
      languages,
      dob,
      nationality,
      marital,
      visa,
      objective,
      format,
      includePhoto,
      photoUrl,
      experience,
      education,
    },
  });

  const settings = await getSettings();
  const to = settings.contactEmail;
  if (to) {
    const hdrs = await headers();
    const host = hdrs.get('host');
    const proto = hdrs.get('x-forwarded-proto') || 'https';
    const link = `${proto}://${host}/admin/cv/${submission.id}`;

    await sendEmail({
      to,
      subject: `New CV submitted: ${name}`,
      html: `
        <p>A new CV was submitted${role ? ` for <strong>${escapeHtml(role)}</strong>` : ''}.</p>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Submitted:</strong> ${new Date(submission.createdAt).toLocaleString()}</p>
        <p><a href="${link}">View and download it in the admin panel</a></p>
      `,
    });
  }

  return { success: true };
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
