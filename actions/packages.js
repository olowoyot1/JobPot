'use server';

const { revalidatePath } = require('next/cache');
const { prisma } = require('../lib/db');
const { requireAdmin } = require('../lib/require-admin');

async function createPackage(countryId, formData) {
  if (!(await requireAdmin())) throw new Error('Not authorized');

  const tier = String(formData.get('tier') || 'custom');
  const name = String(formData.get('name') || '').trim();
  const price = parseInt(String(formData.get('price') || '0'), 10);
  const currency = String(formData.get('currency') || 'GBP');
  const features = String(formData.get('features') || '').trim();

  if (!name) return;

  await prisma.package.create({
    data: { countryId, tier, name, price, currency, features },
  });

  revalidatePath(`/admin/countries/${countryId}`);
  revalidatePath('/destinations');
}

async function updatePackage(id, countryId, formData) {
  if (!(await requireAdmin())) throw new Error('Not authorized');

  const tier = String(formData.get('tier') || 'custom');
  const name = String(formData.get('name') || '').trim();
  const price = parseInt(String(formData.get('price') || '0'), 10);
  const currency = String(formData.get('currency') || 'GBP');
  const features = String(formData.get('features') || '').trim();

  await prisma.package.update({
    where: { id },
    data: { tier, name, price, currency, features },
  });

  revalidatePath(`/admin/countries/${countryId}`);
  revalidatePath(`/destinations/${countryId}`);
}

async function deletePackage(id, countryId) {
  if (!(await requireAdmin())) throw new Error('Not authorized');
  await prisma.package.delete({ where: { id } });
  revalidatePath(`/admin/countries/${countryId}`);
  revalidatePath(`/destinations/${countryId}`);
}

module.exports = { createPackage, updatePackage, deletePackage };
