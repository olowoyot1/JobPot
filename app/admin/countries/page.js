import Link from 'next/link';
import { prisma } from '../../../lib/db';
import { createCountry, deleteCountry } from '../../../actions/countries';

export const dynamic = 'force-dynamic';

const CAT_LABEL = { bilateral: 'Bilateral Agreement', schengen: 'EU Schengen', nonschengen: 'EU Non-Schengen' };

export default async function AdminCountriesPage() {
  const countries = await prisma.country.findMany({
    orderBy: { createdAt: 'asc' },
    include: { _count: { select: { packages: true } } },
  });

  return (
    <main className="max-w-5xl mx-auto px-6 py-14">
      <Link href="/admin" className="text-sm text-golddark font-medium">← Admin home</Link>
      <h1 className="font-display text-2xl text-navy mt-4 mb-1">Destinations</h1>
      <p className="text-sm text-slate mb-8">Add a country, then open it to upload placement packages.</p>

      <div className="bg-white border border-line rounded p-6 mb-10">
        <h2 className="font-display text-lg text-navy mb-4">Add a new destination</h2>
        <form action={createCountry} className="grid md:grid-cols-2 gap-4">
          <Field label="Country name" name="name" placeholder="e.g. Spain" required />
          <Field label="Flag emoji" name="flag" placeholder="🇪🇸" />
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink mb-1">Programme type</label>
            <select name="category" className="w-full border border-line rounded px-3 py-2.5 bg-paper text-sm">
              <option value="bilateral">Bilateral Agreement</option>
              <option value="schengen">EU Schengen</option>
              <option value="nonschengen">EU Non-Schengen</option>
            </select>
          </div>
          <Field label="Vacancies (leave blank for 'Variable')" name="vacancies" type="number" placeholder="e.g. 500" />
          <Field label="Salary range" name="salary" placeholder="e.g. €1,200 – €1,400/mo" required />
          <Field label="Industries (comma separated)" name="industries" placeholder="Construction, Hospitality" />
          <button className="md:col-span-2 bg-gold text-navydeep font-bold rounded py-3 hover:bg-amber">
            Add destination
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-3">
        {countries.map((c) => (
          <div key={c.id} className="bg-white border border-line rounded p-4 grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center">
            <span className="text-2xl">{c.flag}</span>
            <div>
              <h4 className="font-display text-navy">{c.name}</h4>
              <p className="text-xs text-slate">{CAT_LABEL[c.category]} · {c._count.packages} package(s) · {c.vacancies ? c.vacancies.toLocaleString() : 'Variable'} vacancies</p>
            </div>
            <Link href={`/admin/countries/${c.id}`} className="text-sm font-semibold text-golddark underline">
              Manage
            </Link>
            <form action={deleteCountry.bind(null, c.id)}>
              <button className="text-sm font-semibold text-red-700">Delete</button>
            </form>
          </div>
        ))}
      </div>
    </main>
  );
}

function Field({ label, name, type = 'text', placeholder, required }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wide text-ink mb-1">{label}</label>
      <input name={name} type={type} placeholder={placeholder} required={required} className="w-full border border-line rounded px-3 py-2.5 bg-paper text-sm" />
    </div>
  );
}
