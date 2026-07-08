'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../lib/db';
import { requireAdmin } from '../lib/require-admin';

export async function updateSettings(formData) {
  if (!(await requireAdmin())) throw new Error('Not authorized');

  const siteName = String(formData.get('siteName') || '').trim() || 'OAATZ COSULT LTD';
  const tagline = String(formData.get('tagline') || '').trim();
  const footerBlurb = String(formData.get('footerBlurb') || '').trim();
  const contactEmail = String(formData.get('contactEmail') || '').trim();
  const contactWhatsapp = String(formData.get('contactWhatsapp') || '').trim();
  const businessHours = String(formData.get('businessHours') || '').trim();

  await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: { siteName, tagline, footerBlurb, contactEmail, contactWhatsapp, businessHours },
    create: { id: 'singleton', siteName, tagline, footerBlurb, contactEmail, contactWhatsapp, businessHours },
  });

  revalidatePath('/');
  revalidatePath('/admin/settings');
}
