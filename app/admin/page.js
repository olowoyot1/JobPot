import Link from 'next/link';
import { prisma } from '../../lib/db';
import AdminLogoutButton from '../../components/AdminLogoutButton';

export const dynamic = 'force-dynamic';

export default async function AdminHome() {
  const [countryCount, packageCount, orderCount, userCount] = await Promise.all([
    prisma.country.count(),
    prisma.package.count(),
    prisma.order.count(),
    prisma.user.count(),
  ]);

  return (
    <main className="max-w-5xl mx-auto px-6 py-14">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="font-display text-2xl text-navy mb-1">Admin dashboard</h1>
          <p className="text-sm text-slate">Manage destinations, packages, and orders.</p>
        </div>
        <AdminLogoutButton />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <Stat label="Destinations" value={countryCount} />
        <Stat label="Packages" value={packageCount} />
        <Stat label="Orders" value={orderCount} />
        <Stat label="Candidates" value={userCount} />
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <Link href="/admin/countries" className="bg-white border border-line rounded p-6 hover:shadow-md">
          <h3 className="font-display text-lg text-navy mb-1">Destinations & packages</h3>
          <p className="text-sm text-slate">Add, edit, or remove countries and upload placement packages for each.</p>
        </Link>
        <Link href="/admin/orders" className="bg-white border border-line rounded p-6 hover:shadow-md">
          <h3 className="font-display text-lg text-navy mb-1">Orders</h3>
          <p className="text-sm text-slate">Review candidate purchases and update processing status.</p>
        </Link>
        <Link href="/" className="bg-white border border-line rounded p-6 hover:shadow-md">
          <h3 className="font-display text-lg text-navy mb-1">View live marketplace</h3>
          <p className="text-sm text-slate">See exactly what candidates see on the public site.</p>
        </Link>
      </div>
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
