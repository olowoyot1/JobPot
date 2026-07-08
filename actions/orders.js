'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../lib/db';
import { getCurrentUser } from '../lib/require-user';
import { requireAdmin } from '../lib/require-admin';

function generateRef() {
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `OZ-${rand}-${new Date().getFullYear()}`;
}

export async function createOrder(packageId) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Please log in to buy a package.' };

  const pkg = await prisma.package.findUnique({
    where: { id: packageId },
    include: { country: true },
  });
  if (!pkg) return { error: 'This package no longer exists.' };

  const order = await prisma.order.create({
    data: {
      ref: generateRef(),
      userId: user.id,
      packageId: pkg.id,
      countryName: pkg.country.name,
      packageName: pkg.name,
      price: pkg.price,
      status: 'pending',
    },
  });

  revalidatePath('/account');
  return { success: true, ref: order.ref };
}

export async function updateOrderStatus(orderId, status) {
  if (!(await requireAdmin())) throw new Error('Not authorized');
  await prisma.order.update({ where: { id: orderId }, data: { status } });
  revalidatePath('/admin/orders');
}
