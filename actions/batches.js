'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../lib/db';
import { requireAdmin } from '../lib/require-admin';

export async function createBatch(countryId, formData) {
  if (!(await requireAdmin())) throw new Error('Not authorized');

  const name = String(formData.get('name') || '').trim();
  const totalSlots = parseInt(String(formData.get('totalSlots') || '0'), 10);
  const startDateRaw = String(formData.get('startDate') || '');
  const status = String(formData.get('status') || 'open');

  if (!name || !totalSlots) return;

  await prisma.batch.create({
    data: {
      countryId,
      name,
      totalSlots,
      status,
      startDate: startDateRaw ? new Date(startDateRaw) : null,
    },
  });

  revalidatePath(`/admin/countries/${countryId}`);
  revalidatePath(`/destinations/${countryId}`);
}

export async function updateBatch(id, countryId, formData) {
  if (!(await requireAdmin())) throw new Error('Not authorized');

  const name = String(formData.get('name') || '').trim();
  const totalSlots = parseInt(String(formData.get('totalSlots') || '0'), 10);
  const startDateRaw = String(formData.get('startDate') || '');
  const status = String(formData.get('status') || 'open');

  await prisma.batch.update({
    where: { id },
    data: {
      name,
      totalSlots,
      status,
      startDate: startDateRaw ? new Date(startDateRaw) : null,
    },
  });

  revalidatePath(`/admin/countries/${countryId}`);
  revalidatePath(`/destinations/${countryId}`);
}

export async function deleteBatch(id, countryId) {
  if (!(await requireAdmin())) throw new Error('Not authorized');
  await prisma.batch.delete({ where: { id } });
  revalidatePath(`/admin/countries/${countryId}`);
  revalidatePath(`/destinations/${countryId}`);
}
