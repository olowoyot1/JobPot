import { prisma } from '../../lib/db';
import { getCurrentUser } from '../../lib/require-user';
import LogoutButton from '../../components/LogoutButton';
import DocumentUpload from '../../components/DocumentUpload';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const [orders, documents] = await Promise.all([
    prisma.order.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } }),
    prisma.document.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } }),
  ]);

  return (
    <main className="max-w-4xl mx-auto px-6 py-14">
      <h1 className="font-display text-2xl text-navy mb-1">My account</h1>
      <p className="text-sm text-slate mb-8">Your profile, orders, and documents.</p>

      <div className="grid md:grid-cols-[260px_1fr] gap-7">
        <div className="bg-white border border-line rounded p-6 h-fit">
          <div className="w-14 h-14 rounded-full bg-navy text-amber flex items-center justify-center font-display text-xl mb-3">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h3 className="font-display text-lg text-navy mb-0.5">{user.name}</h3>
          <p className="text-sm text-slate">{user.email}</p>
          <hr className="my-4 border-line" />
          <Row label="Phone" value={user.phone || '—'} />
          <Row label="Preferred" value={user.preferred || 'Not set'} />
          <Row label="Orders" value={String(orders.length)} />
          <hr className="my-4 border-line" />
          <LogoutButton />
        </div>

        <div className="flex flex-col gap-6">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-slate border border-dashed border-line rounded">
              No packages purchased yet.<br />Browse destinations to get started.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {orders.map((o) => (
                <div key={o.id} className="bg-white border border-line rounded p-4 grid grid-cols-[1fr_auto] gap-4 items-center">
                  <div>
                    <h4 className="font-display text-navy">{o.packageName} — {o.countryName}</h4>
                    <p className="text-xs text-slate">Ref: {o.ref} · Purchased {o.createdAt.toLocaleDateString()}</p>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wide bg-[#F5E6BC] text-golddark px-3 py-1.5 rounded-full">
                    {o.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          <DocumentUpload documents={documents} />
        </div>
      </div>
    </main>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm mb-2">
      <span className="text-slate">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
