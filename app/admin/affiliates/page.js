import Link from 'next/link';
import { prisma } from '../../../lib/db';
import { markCommissionPaid } from '../../../actions/affiliates';

export const dynamic = 'force-dynamic';

export default async function AdminAffiliatesPage() {
  const affiliates = await prisma.affiliate.findMany({
    orderBy: { createdAt: 'asc' },
    include: {
      referrals: true,
      commissions: { include: { order: true }, orderBy: { createdAt: 'desc' } },
    },
  });

  return (
    <main className="max-w-5xl mx-auto px-6 py-14">
      <Link href="/admin" className="text-sm text-golddark font-medium">← Admin home</Link>
      <h1 className="font-display text-2xl text-navy mt-4 mb-1">Affiliates</h1>
      <p className="text-sm text-slate mb-8">
        Partners sign up themselves at <code>/affiliate/signup</code>. Review their referrals and mark commissions as paid here.
      </p>

      {affiliates.length === 0 ? (
        <div className="text-center py-12 text-slate border border-dashed border-line rounded">No affiliates yet.</div>
      ) : (
        <div className="flex flex-col gap-6">
          {affiliates.map((a) => {
            const pending = a.commissions.filter((c) => c.status === 'pending').reduce((s, c) => s + c.amount, 0);
            const paid = a.commissions.filter((c) => c.status === 'paid').reduce((s, c) => s + c.amount, 0);
            return (
              <div key={a.id} className="bg-white border border-line rounded p-5">
                <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
                  <div>
                    <h3 className="font-display text-lg text-navy">{a.name}</h3>
                    <p className="text-xs text-slate">{a.email} · code: <span className="font-mono">{a.code}</span> · {a.commissionPct}% commission</p>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span>{a.referrals.length} referrals</span>
                    <span className="text-golddark font-semibold">£{pending} pending</span>
                    <span className="text-teal font-semibold">£{paid} paid</span>
                  </div>
                </div>
                {a.commissions.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {a.commissions.map((c) => (
                      <div key={c.id} className="flex items-center justify-between text-sm border-t border-line pt-2">
                        <span>£{c.amount} — {c.order.packageName} ({c.order.ref})</span>
                        {c.status === 'paid' ? (
                          <span className="text-xs font-mono uppercase text-teal">Paid</span>
                        ) : (
                          <form action={markCommissionPaid.bind(null, c.id)}>
                            <button className="text-xs font-semibold text-golddark underline">Mark as paid</button>
                          </form>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
