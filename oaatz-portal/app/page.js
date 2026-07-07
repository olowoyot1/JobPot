import { prisma } from '../lib/db';
import Marketplace from '../components/Marketplace';
import DepartureBoard from '../components/DepartureBoard';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const countries = await prisma.country.findMany({
    orderBy: { createdAt: 'asc' },
    include: { packages: true },
  });

  const totalVacancies = countries.reduce((sum, c) => sum + (c.vacancies || 0), 0);

  return (
    <main>
      <section className="bg-navy text-white px-6 py-14 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="font-mono text-[11px] tracking-[3px] text-amber uppercase mb-4">
            International Work Placement Marketplace
          </div>
          <h1 className="font-display font-semibold text-4xl md:text-5xl leading-tight mb-4 max-w-[14ch]">
            Your next job is a <em className="italic text-amber font-medium">departure</em> away.
          </h1>
          <p className="text-[#D6DEE9] max-w-[46ch] mb-7">
            Compare verified vacancies across dozens of destination countries, choose the placement
            package that fits your budget, and let our team handle the paperwork from application to arrival.
          </p>
          <div className="flex gap-3 flex-wrap">
            <a href="#marketplace" className="bg-gold text-navydeep font-semibold px-6 py-3 rounded hover:bg-amber">
              Browse destinations
            </a>
            <a href="/signup" className="border border-white/35 px-6 py-3 rounded font-semibold hover:border-white">
              Create free account
            </a>
          </div>
        </div>
        <DepartureBoard countries={countries} />
      </section>

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

      <section id="how" className="max-w-6xl mx-auto px-6 py-16">
        <div className="max-w-xl mb-9">
          <div className="font-mono text-[11px] tracking-[2px] text-golddark uppercase mb-2">How it works</div>
          <h2 className="font-display text-3xl text-navy mb-2">Three steps from application to arrival</h2>
          <p className="text-slate text-sm">OAATZ CONSULT LTD manages the process end to end so you can focus on preparing for the move.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            ['01 — Register', 'Create your account', "Tell us who you are and what kind of work you're looking for. It takes under two minutes."],
            ['02 — Choose', 'Pick a destination & package', 'Browse live vacancies by country, compare salaries and industries, then select a placement package.'],
            ['03 — Travel', 'We handle the rest', 'Our team coordinates your documentation, visa appointment, and pre-departure orientation.'],
          ].map(([num, title, body]) => (
            <div key={num} className="bg-white border border-line rounded p-6">
              <div className="font-mono text-xs text-golddark tracking-wide mb-3">{num}</div>
              <h3 className="font-display text-lg text-navy mb-1">{title}</h3>
              <p className="text-sm text-slate">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="marketplace" className="max-w-6xl mx-auto px-6 pb-20">
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
