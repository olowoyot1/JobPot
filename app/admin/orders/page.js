import Link from 'next/link';
import { prisma } from '../../../lib/db';
import OrderStatusForm from '../../../components/OrderStatusForm';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true },
  });

  return (
    <main className="max-w-5xl mx-auto px-6 py-14">
      <Link href="/admin" className="text-sm text-golddark font-medium">← Admin home</Link>
      <h1 className="font-display text-2xl text-navy mt-4 mb-1">Orders</h1>
      <p className="text-sm text-slate mb-8">Review purchases and update processing status.</p>

      {orders.length === 0 ? (
        <div className="text-center py-12 text-slate border border-dashed border-line rounded">No orders yet.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((o) => (
            <div key={o.id} className="bg-white border border-line rounded p-4 grid md:grid-cols-[1fr_auto] gap-3 items-center">
              <div>
                <h4 className="font-display text-navy">{o.packageName} — {o.countryName}</h4>
                <p className="text-xs text-slate">
                  Ref {o.ref} · {o.user.name} ({o.user.email}) · £{o.price} · {o.createdAt.toLocaleDateString()}
                </p>
              </div>
              <OrderStatusForm orderId={o.id} status={o.status} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
