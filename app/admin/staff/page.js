import Link from 'next/link';
import { prisma } from '../../../lib/db';
import { createStaff, deleteStaff } from '../../../actions/staff';

export const dynamic = 'force-dynamic';

export default async function AdminStaffPage() {
  const staff = await prisma.staff.findMany({ orderBy: { createdAt: 'asc' } });

  return (
    <main className="max-w-3xl mx-auto px-6 py-14">
      <Link href="/admin" className="text-sm text-golddark font-medium">← Admin home</Link>
      <h1 className="font-display text-2xl text-navy mt-4 mb-1">Staff accounts</h1>
      <p className="text-sm text-slate mb-8">
        Staff can view and manage orders and applicant documents at <code>/staff</code>, but cannot edit destinations, packages, or prices.
      </p>

      <div className="bg-white border border-line rounded p-6 mb-8">
        <h2 className="font-display text-lg text-navy mb-4">Add a staff member</h2>
        <form action={createStaff} className="grid md:grid-cols-3 gap-3">
          <Field label="Full name" name="name" required />
          <Field label="Email" name="email" type="email" required />
          <Field label="Password" name="password" type="password" placeholder="Min. 6 characters" required />
          <button className="md:col-span-3 bg-gold text-navydeep font-bold rounded py-3 hover:bg-amber">
            Create staff account
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-3">
        {staff.map((s) => (
          <div key={s.id} className="bg-white border border-line rounded p-4 flex items-center justify-between">
            <div>
              <h4 className="font-display text-navy">{s.name}</h4>
              <p className="text-xs text-slate">{s.email}</p>
            </div>
            <form action={deleteStaff.bind(null, s.id)}>
              <button className="text-sm font-semibold text-red-700">Remove</button>
            </form>
          </div>
        ))}
        {staff.length === 0 && (
          <div className="text-center py-8 text-slate border border-dashed border-line rounded">No staff accounts yet.</div>
        )}
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
