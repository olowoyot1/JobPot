import Link from 'next/link';
import { prisma } from '../../lib/db';
import AdminLogoutButton from '../../components/AdminLogoutButton';

export const dynamic = 'force-dynamic';

export default async function AdminHome() {
  const [countryCount, packageCount, orderCount, userCount, staffCount, affiliateCount, docCount, batchCount, blockCount, cvCount] = await Promise.all([
    prisma.country.count(),
    prisma.package.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.staff.count(),
    prisma.affiliate.count(),
    prisma.document.count(),
    prisma.batch.count(),
    prisma.pageBlock.count(),
    prisma.cvSubmission.count(),
  ]);

  return (
    <main className="max-w-5xl mx-auto px-6 py-14">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="font-display text-2xl text-navy mb-1">Admin dashboard</h1>
          <p className="text-sm text-slate">Manage destinations, packages, batches, orders, staff, and affiliates.</p>
        </div>
        <AdminLogoutButton />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <Stat label="Destinations" value={countryCount} />
        <Stat label="Packages" value={packageCount} />
        <Stat label="Batches" value={batchCount} />
        <Stat label="Orders" value={orderCount} />
        <Stat label="Candidates" value={userCount} />
        <Stat label="Documents" value={docCount} />
        <Stat label="CV submissions" value={cvCount} />
        <Stat label="Staff" value={staffCount} />
        <Stat label="Affiliates" value={affiliateCount} />
        <Stat label="Content blocks" value={blockCount} />
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <Link href="/admin/content" className="bg-white border border-line rounded p-6 hover:shadow-md">
          <h3 className="font-display text-lg text-navy mb-1">Homepage content</h3>
          <p className="text-sm text-slate">Add, reorder, hide, or delete homepage sections — hero, steps, banners, images, and more.</p>
        </Link>
        <Link href="/admin/settings" className="bg-white border border-line rounded p-6 hover:shadow-md">
          <h3 className="font-display text-lg text-navy mb-1">Site settings</h3>
          <p className="text-sm text-slate">Brand name, tagline, footer text, and contact details shown site-wide.</p>
        </Link>
        <Link href="/admin/countries" className="bg-white border border-line rounded p-6 hover:shadow-md">
          <h3 className="font-display text-lg text-navy mb-1">Destinations, packages & batches</h3>
          <p className="text-sm text-slate">Add countries, upload placement packages, and open batch slot pools for each.</p>
        </Link>
        <Link href="/admin/orders" className="bg-white border border-line rounded p-6 hover:shadow-md">
          <h3 className="font-display text-lg text-navy mb-1">Orders</h3>
          <p className="text-sm text-slate">Review candidate purchases and update processing status.</p>
        </Link>
        <Link href="/admin/cv" className="bg-white border border-line rounded p-6 hover:shadow-md">
          <h3 className="font-display text-lg text-navy mb-1">CV submissions</h3>
          <p className="text-sm text-slate">View CVs candidates submitted at /cv and download them as PDFs in any format.</p>
        </Link>
        <Link href="/admin/staff" className="bg-white border border-line rounded p-6 hover:shadow-md">
          <h3 className="font-display text-lg text-navy mb-1">Staff accounts</h3>
          <p className="text-sm text-slate">Create staff logins that can manage orders & documents only.</p>
        </Link>
        <Link href="/admin/affiliates" className="bg-white border border-line rounded p-6 hover:shadow-md">
          <h3 className="font-display text-lg text-navy mb-1">Affiliates</h3>
          <p className="text-sm text-slate">Review partner referrals and mark commissions as paid.</p>
        </Link>
        <Link href="/staff" className="bg-white border border-line rounded p-6 hover:shadow-md">
          <h3 className="font-display text-lg text-navy mb-1">Staff view (documents)</h3>
          <p className="text-sm text-slate">See the orders + document review screen staff use.</p>
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
