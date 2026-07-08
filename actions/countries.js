'use server';

const { revalidatePath } = require('next/cache');
const { redirect } = require('next/navigation');
const { prisma } = require('../lib/db');
const { requireAdmin } = require('../lib/require-admin');

async function createCountry(formData) {
  if (!(await requireAdmin())) throw new Error('Not authorized');

  const name = String(formData.get('name') || '').trim();
  const flag = String(formData.get('flag') || '🏳️').trim();
  const category = String(formData.get('category') || 'bilateral');
  const vacanciesRaw = String(formData.get('vacancies') || '').trim();
  const salary = String(formData.get('salary') || '').trim();
  const industries = String(formData.get('industries') || '').trim();

  if (!name || !salary) return;

  await prisma.country.create({
    data: {
      name,
      flag,
      category,
      vacancies: vacanciesRaw ? parseInt(vacanciesRaw, 10) : null,
      salary,
      industries,
    },
  });

  revalidatePath('/admin/countries');
  revalidatePath('/');
}

async function updateCountry(id, formData) {
  if (!(await requireAdmin())) throw new Error('Not authorized');

  const name = String(formData.get('name') || '').trim();
  const flag = String(formData.get('flag') || '🏳️').trim();
  const category = String(formData.get('category') || 'bilateral');
  const vacanciesRaw = String(formData.get('vacancies') || '').trim();
  const salary = String(formData.get('salary') || '').trim();
  const industries = String(formData.get('industries') || '').trim();

  await prisma.country.update({
    where: { id },
    data: {
      name,
      flag,
      category,
      vacancies: vacanciesRaw ? parseInt(vacanciesRaw, 10) : null,
      salary,
      industries,
    },
  });

  revalidatePath('/admin/countries');
  revalidatePath(`/admin/countries/${id}`);
  revalidatePath('/');
}

async function deleteCountry(id) {
  if (!(await requireAdmin())) throw new Error('Not authorized');
  await prisma.country.delete({ where: { id } });
  revalidatePath('/admin/countries');
  revalidatePath('/');
  redirect('/admin/countries');
}

module.exports = { createCountry, updateCountry, deleteCountry };
