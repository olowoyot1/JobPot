'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../lib/db';
import { getCurrentUser } from '../lib/require-user';
import { getCurrentStaff } from '../lib/require-staff';
import { requireAdmin } from '../lib/require-admin';

function generateRef() {
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `OZ-${rand}-${new Date().getFullYear()}`;
}

export async function createOrder(packageId, batchId) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Please log in to buy a package.' };

  const pkg = await prisma.package.findUnique({
    where: { id: packageId },
    include: { country: true },
  });
  if (!pkg) return { error: 'This package no longer exists.' };

  if (batchId) {
    const batch = await prisma.batch.findUnique({ where: { id: batchId } });
    if (!batch || batch.status !== 'open') {
      return { error: 'This batch is no longer accepting applicants.' };
    }
    const filled = await prisma.order.count({
      where: { batchId, status: { not: 'rejected' } },
    });
    if (filled >= batch.totalSlots) {
      return { error: 'This batch is full. Please choose another batch.' };
    }
  }

  const order = await prisma.order.create({
    data: {
      ref: generateRef(),
      userId: user.id,
      packageId: pkg.id,
      batchId: batchId || null,
      countryName: pkg.country.name,
      packageName: pkg.name,
      price: pkg.price,
      status: 'pending',
    },
  });

  if (user.referredById) {
    const affiliate = await prisma.affiliate.findUnique({ where: { id: user.referredById } });
    if (affiliate) {
      const amount = Math.round((pkg.price * affiliate.commissionPct) / 100);
      await prisma.commission.create({
        data: { affiliateId: affiliate.id, orderId: order.id, amount, status: 'pending' },
      });
    }
  }

  revalidatePath('/account');
  return { success: true, ref: order.ref };
}

export async function updateOrderStatus(orderId, status) {
  const isAdmin = await requireAdmin();
  const staff = isAdmin ? null : await getCurrentStaff();
  if (!isAdmin && !staff) throw new Error('Not authorized');
  await prisma.order.update({ where: { id: orderId }, data: { status } });
  revalidatePath('/admin/orders');
  revalidatePath('/staff');
}
