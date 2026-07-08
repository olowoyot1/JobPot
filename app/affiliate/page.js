import { prisma } from '../../lib/db';
import { getCurrentAffiliate } from '../../lib/require-affiliate';
import AffiliateLogoutButton from '../../components/AffiliateLogoutButton';
import { redirect } from 'next/navigation';
import ReferralLink from '../../components/ReferralLink';

export const dynamic = 'force-dynamic';

export default async function AffiliateDashboard() {
  const affiliate = await getCurrentAffiliate();
  if (!affiliate) redirect('/affiliate/login');

  const [referrals, commissions] = await Promise.all([
    prisma.user.findMany({
      where: { referredById: affiliate.id },
      orderBy: { createdAt: 'desc' },
      include: { orders: { orderBy: { createdAt: 'desc' }, take: 1 } },
    }),
    prisma.commission.findMany({
      where: { affiliateId: affiliate.id },
      orderBy: { createdAt: 'desc' },
      include: { order: true },
    }),
  ]);

  const totalEarned = commissions.reduce((s, c) => s + c.amount, 0);
  const totalPending = commissions.filter((c) => c.status === 'pending').reduce((s, c) => s + c.amount, 0);
  const totalPaid = commissions.filter((c) => c.status === 'paid').reduce((s, c) => s + c.amount, 0);

  return (
    <main className="max-w-5xl mx-auto px-6 py-14">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="font-display text-2xl text-navy mb-1">Partner dashboard</h1>
          <p className="text-sm text-slate">Welcome back, {affiliate.name}.</p>
        </div>
        <AffiliateLogoutButton />
      </div>

      <ReferralLink code={affiliate.code} />

      <div className="grid grid-cols-3 gap-4 my-8">
        <Stat label="Total commission" value={`£${totalEarned}`} />
        <Stat label="Pending" value={`£${totalPending}`} />
        <Stat label="Paid out" value={`£${totalPaid}`} />
      </div>

      <h2 className="font-display text-lg text-navy mb-3">Your referred candidates ({referrals.length})</h2>
      {referrals.length === 0 ? (
        <div className="text-center py-8 text-slate border border-dashed border-line rounded mb-10">
          No referrals yet — share your link above to get started.
        </div>
      ) : (
        <div className="flex flex-col gap-3 mb-10">
          {referrals.map((r) => {
            const latest = r.orders[0];
            return (
              <div key={r.id} className="bg-white border border-line rounded p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-display text-navy">{r.name}</h4>
                  <p className="text-xs text-slate">{r.email} · joined {r.createdAt.toLocaleDateString()}</p>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wide bg-[#FBF3E1] text-golddark px-3 py-1.5 rounded-full">
                  {latest ? latest.status : 'no application yet'}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <h2 className="font-display text-lg text-navy mb-3">Commission history</h2>
      {commissions.length === 0 ? (
        <div className="text-center py-8 text-slate border border-dashed border-line rounded">No commissions yet.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {commissions.map((c) => (
            <div key={c.id} className="bg-white border border-line rounded p-4 flex items-center justify-between">
              <div>
                <h4 className="font-display text-navy">£{c.amount} — {c.order.packageName}</h4>
                <p className="text-xs text-slate">Order {c.order.ref} · {c.createdAt.toLocaleDateString()}</p>
              </div>
              <span className={`font-mono text-[10px] uppercase tracking-wide px-3 py-1.5 rounded-full ${c.status === 'paid' ? 'bg-[#E4F0EC] text-teal' : 'bg-[#FBF3E1] text-golddark'}`}>
                {c.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-white border border-line rounded p-5 text-center">
      <b className="block font-display text-2xl text-navy">{value}</b>
      <span className="text-xs uppercase tracking-wide text-slate">{label}</span>
    </div>
  );
}
