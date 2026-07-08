import { prisma } from '../../lib/db';
import OrderStatusForm from '../../components/OrderStatusForm';
import DocumentStatusForm from '../../components/DocumentStatusForm';
import StaffLogoutButton from '../../components/StaffLogoutButton';

export const dynamic = 'force-dynamic';

export default async function StaffDashboard() {
  const [orders, documents] = await Promise.all([
    prisma.order.findMany({ orderBy: { createdAt: 'desc' }, include: { user: true } }),
    prisma.document.findMany({ orderBy: { createdAt: 'desc' }, include: { user: true } }),
  ]);

  return (
    <main className="max-w-5xl mx-auto px-6 py-14">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="font-display text-2xl text-navy mb-1">Staff dashboard</h1>
          <p className="text-sm text-slate">Review candidate orders and submitted documents.</p>
        </div>
        <StaffLogoutButton />
      </div>

      <h2 className="font-display text-lg text-navy mb-3">Orders</h2>
      {orders.length === 0 ? (
        <div className="text-center py-8 text-slate border border-dashed border-line rounded mb-10">No orders yet.</div>
      ) : (
        <div className="flex flex-col gap-3 mb-10">
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

      <h2 className="font-display text-lg text-navy mb-3">Applicant documents</h2>
      {documents.length === 0 ? (
        <div className="text-center py-8 text-slate border border-dashed border-line rounded">No documents uploaded yet.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {documents.map((d) => (
            <div key={d.id} className="bg-white border border-line rounded p-4 grid md:grid-cols-[1fr_auto_auto] gap-3 items-center">
              <div>
                <h4 className="font-display text-navy capitalize">{d.type}</h4>
                <p className="text-xs text-slate">{d.user.name} ({d.user.email}) · {d.fileName} · {d.createdAt.toLocaleDateString()}</p>
              </div>
              <a href={d.fileUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-golddark underline">View file</a>
              <DocumentStatusForm docId={d.id} status={d.status} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
