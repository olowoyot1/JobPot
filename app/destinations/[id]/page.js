import { prisma } from '../../../lib/db';
import { getCurrentUser } from '../../../lib/require-user';
import BuyButton from '../../../components/BuyButton';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

const CAT_LABEL = { bilateral: 'Bilateral Agreement', schengen: 'EU Schengen', nonschengen: 'EU Non-Schengen' };
const TIER_ACCENT = { standard: 'border-l-slate', express: 'border-l-gold', premium: 'border-l-teal' };

export default async function DestinationPage({ params }) {
  const { id } = await params;
  const country = await prisma.country.findUnique({
    where: { id },
    include: { packages: { orderBy: { price: 'asc' } } },
  });
  if (!country) notFound();

  const user = await getCurrentUser().catch(() => null);

  return (
    <main className="max-w-3xl mx-auto px-6 py-14">
      <Link href="/#marketplace" className="text-sm text-golddark font-medium">← Back to destinations</Link>

      <div className="flex items-center gap-4 mt-5 mb-8 pb-6 border-b border-line">
        <span className="text-4xl">{country.flag}</span>
        <div>
          <h1 className="font-display text-2xl text-navy">{country.name}</h1>
          <span className="text-sm text-slate">
            {CAT_LABEL[country.category]} · {country.vacancies ? country.vacancies.toLocaleString() : 'Variable'} vacancies · {country.salary}
          </span>
        </div>
      </div>

      {country.packages.length === 0 ? (
        <div className="text-center py-12 text-slate border border-dashed border-line rounded">
          No packages have been added for this destination yet.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {country.packages.map((p) => (
            <div key={p.id} className={`border border-line border-l-4 ${TIER_ACCENT[p.tier] || 'border-l-slate'} rounded p-5 grid sm:grid-cols-[1fr_auto] gap-4`}>
              <div>
                <h4 className="font-display text-lg text-navy mb-1">{p.name}</h4>
                <ul className="list-disc list-inside text-sm text-slate space-y-0.5">
                  {p.features.split('\n').filter(Boolean).map((f) => <li key={f}>{f}</li>)}
                </ul>
              </div>
              <div className="flex flex-col items-start sm:items-end gap-2">
                <div className="font-mono text-lg font-semibold text-navy">
                  {p.currency === 'GBP' ? '£' : p.currency + ' '}{p.price}
                  <small className="block font-body text-[10px] text-slate font-normal">service fee</small>
                </div>
                <BuyButton packageId={p.id} loggedIn={Boolean(user)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
