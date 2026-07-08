import Link from 'next/link';
import { prisma } from '../../../../lib/db';
import { updateCountry } from '../../../../actions/countries';
import { createPackage, updatePackage, deletePackage } from '../../../../actions/packages';
import { createBatch, updateBatch, deleteBatch } from '../../../../actions/batches';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditCountryPage({ params }) {
  const { id } = await params;
  const country = await prisma.country.findUnique({
    where: { id },
    include: {
      packages: { orderBy: { price: 'asc' } },
      batches: { orderBy: { createdAt: 'asc' }, include: { _count: { select: { orders: true } } } },
    },
  });
  if (!country) notFound();

  const boundUpdateCountry = updateCountry.bind(null, country.id);
  const boundCreatePackage = createPackage.bind(null, country.id);
  const boundCreateBatch = createBatch.bind(null, country.id);

  return (
    <main className="max-w-4xl mx-auto px-6 py-14">
      <Link href="/admin/countries" className="text-sm text-golddark font-medium">← All destinations</Link>
      <h1 className="font-display text-2xl text-navy mt-4 mb-1">{country.flag} {country.name}</h1>
      <p className="text-sm text-slate mb-8">Edit destination details and manage its placement packages.</p>

      <div className="bg-white border border-line rounded p-6 mb-10">
        <h2 className="font-display text-lg text-navy mb-4">Destination details</h2>
        <form action={boundUpdateCountry} className="grid md:grid-cols-2 gap-4">
          <Field label="Country name" name="name" defaultValue={country.name} required />
          <Field label="Flag emoji" name="flag" defaultValue={country.flag} />
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink mb-1">Programme type</label>
            <select name="category" defaultValue={country.category} className="w-full border border-line rounded px-3 py-2.5 bg-paper text-sm">
              <option value="bilateral">Bilateral Agreement</option>
              <option value="schengen">EU Schengen</option>
              <option value="nonschengen">EU Non-Schengen</option>
            </select>
          </div>
          <Field label="Vacancies" name="vacancies" type="number" defaultValue={country.vacancies ?? ''} />
          <Field label="Salary range" name="salary" defaultValue={country.salary} required />
          <Field label="Industries (comma separated)" name="industries" defaultValue={country.industries} />
          <button className="md:col-span-2 bg-navy text-white font-bold rounded py-3 hover:bg-navydeep">
            Save changes
          </button>
        </form>
      </div>

      <h2 className="font-display text-lg text-navy mb-4">Batches (slot pools)</h2>
      <p className="text-sm text-slate mb-4 -mt-2">
        A batch represents a group of candidates travelling together for a given intake
        (e.g. "January 2027 Intake — 50 slots"). Candidates optionally pick a batch when buying a package.
      </p>
      <div className="flex flex-col gap-4 mb-8">
        {country.batches.map((b) => (
          <div key={b.id} className="bg-white border border-line rounded p-5">
            <form action={updateBatch.bind(null, b.id, country.id)} className="grid md:grid-cols-2 gap-3">
              <Field label="Batch name" name="name" defaultValue={b.name} required />
              <Field label="Total slots" name="totalSlots" type="number" defaultValue={b.totalSlots} required />
              <Field label="Start date" name="startDate" type="date" defaultValue={b.startDate ? b.startDate.toISOString().slice(0, 10) : ''} />
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-ink mb-1">Status</label>
                <select name="status" defaultValue={b.status} className="w-full border border-line rounded px-3 py-2 bg-paper text-sm">
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className="md:col-span-2 flex items-center gap-4">
                <button className="bg-gold text-navydeep font-semibold rounded px-5 py-2 text-sm hover:bg-amber">Save batch</button>
                <span className="text-xs text-slate">{b._count.orders} / {b.totalSlots} slots filled</span>
              </div>
            </form>
            <form action={deleteBatch.bind(null, b.id, country.id)} className="mt-2">
              <button className="text-sm font-semibold text-red-700">Delete batch</button>
            </form>
          </div>
        ))}
        {country.batches.length === 0 && (
          <div className="text-center py-8 text-slate border border-dashed border-line rounded">No batches yet — add one below.</div>
        )}
      </div>

      <div className="bg-white border border-line rounded p-6 mb-10">
        <h3 className="font-display text-lg text-navy mb-4">Add a new batch</h3>
        <form action={boundCreateBatch} className="grid md:grid-cols-2 gap-3">
          <Field label="Batch name" name="name" placeholder="e.g. January 2027 Intake" required />
          <Field label="Total slots" name="totalSlots" type="number" placeholder="50" required />
          <Field label="Start date (optional)" name="startDate" type="date" />
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink mb-1">Status</label>
            <select name="status" className="w-full border border-line rounded px-3 py-2 bg-paper text-sm">
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <button className="md:col-span-2 bg-navy text-white font-bold rounded py-3 hover:bg-navydeep">
            Add batch
          </button>
        </form>
      </div>

      <h2 className="font-display text-lg text-navy mb-4">Packages</h2>
      <div className="flex flex-col gap-4 mb-8">
        {country.packages.map((p) => (
          <div key={p.id} className="bg-white border border-line rounded p-5">
            <form action={updatePackage.bind(null, p.id, country.id)} className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-ink mb-1">Tier</label>
                <select name="tier" defaultValue={p.tier} className="w-full border border-line rounded px-3 py-2 bg-paper text-sm">
                  <option value="standard">Standard</option>
                  <option value="express">Express</option>
                  <option value="premium">Premium</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <Field label="Package name" name="name" defaultValue={p.name} required />
              <Field label="Price" name="price" type="number" defaultValue={p.price} required />
              <Field label="Currency" name="currency" defaultValue={p.currency} />
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wide text-ink mb-1">Features (one per line)</label>
                <textarea name="features" defaultValue={p.features} rows={4} className="w-full border border-line rounded px-3 py-2 bg-paper text-sm" />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button className="bg-gold text-navydeep font-semibold rounded px-5 py-2 text-sm hover:bg-amber">Save package</button>
              </div>
            </form>
            <form action={deletePackage.bind(null, p.id, country.id)} className="mt-2">
              <button className="text-sm font-semibold text-red-700">Delete package</button>
            </form>
          </div>
        ))}
        {country.packages.length === 0 && (
          <div className="text-center py-8 text-slate border border-dashed border-line rounded">No packages yet — add one below.</div>
        )}
      </div>

      <div className="bg-white border border-line rounded p-6">
        <h3 className="font-display text-lg text-navy mb-4">Add a new package</h3>
        <form action={boundCreatePackage} className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink mb-1">Tier</label>
            <select name="tier" className="w-full border border-line rounded px-3 py-2 bg-paper text-sm">
              <option value="standard">Standard</option>
              <option value="express">Express</option>
              <option value="premium">Premium</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <Field label="Package name" name="name" placeholder="e.g. Standard" required />
          <Field label="Price" name="price" type="number" placeholder="220" required />
          <Field label="Currency" name="currency" placeholder="GBP" />
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink mb-1">Features (one per line)</label>
            <textarea name="features" rows={4} placeholder={'Document review & job matching\nApplication submission\nEmail support'} className="w-full border border-line rounded px-3 py-2 bg-paper text-sm" />
          </div>
          <button className="md:col-span-2 bg-navy text-white font-bold rounded py-3 hover:bg-navydeep">
            Add package
          </button>
        </form>
      </div>
    </main>
  );
}

function Field({ label, name, type = 'text', placeholder, defaultValue, required }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wide text-ink mb-1">{label}</label>
      <input name={name} type={type} placeholder={placeholder} defaultValue={defaultValue} required={required} className="w-full border border-line rounded px-3 py-2.5 bg-paper text-sm" />
    </div>
  );
}
