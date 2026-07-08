import { prisma } from '../lib/db';
import Marketplace from '../components/Marketplace';
import BlockRenderer from '../components/BlockRenderer';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [countries, blocks] = await Promise.all([
    prisma.country.findMany({ orderBy: { createdAt: 'asc' }, include: { packages: true } }),
    prisma.pageBlock.findMany({ where: { visible: true }, orderBy: { order: 'asc' } }),
  ]);

  const totalVacancies = countries.reduce((sum, c) => sum + (c.vacancies || 0), 0);

  return (
    <main>
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} countries={countries} />
      ))}

      <div className="grid grid-cols-2 md:grid-cols-4 bg-white border-b border-line text-center">
        <div className="p-6 border-r border-line">
          <b className="block font-display text-3xl text-navy">{countries.length}</b>
          <span className="text-xs uppercase tracking-wide text-slate">Destinations</span>
        </div>
        <div className="p-6 border-r border-line">
          <b className="block font-display text-3xl text-navy">{totalVacancies.toLocaleString()}+</b>
          <span className="text-xs uppercase tracking-wide text-slate">Open Vacancies</span>
        </div>
        <div className="p-6 border-r border-line">
          <b className="block font-display text-3xl text-navy">3</b>
          <span className="text-xs uppercase tracking-wide text-slate">Programme Types</span>
        </div>
        <div className="p-6">
          <b className="block font-display text-3xl text-navy">24/7</b>
          <span className="text-xs uppercase tracking-wide text-slate">Application Access</span>
        </div>
      </div>

      <section id="marketplace" className="max-w-6xl mx-auto px-6 py-16">
        <div className="max-w-xl mb-8">
          <div className="font-mono text-[11px] tracking-[2px] text-golddark uppercase mb-2">Marketplace</div>
          <h2 className="font-display text-3xl text-navy mb-2">Choose your destination</h2>
          <p className="text-slate text-sm">Filter by programme type or search for a country. Vacancy counts and packages are managed by our team via the admin dashboard.</p>
        </div>
        <Marketplace countries={countries} />
      </section>
    </main>
  );
}
