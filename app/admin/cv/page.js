import Link from 'next/link';
import { prisma } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminCvPage() {
  const submissions = await prisma.cvSubmission.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <main className="max-w-5xl mx-auto px-6 py-14">
      <Link href="/admin" className="text-sm text-golddark font-medium">
        ← Admin home
      </Link>
      <h1 className="font-display text-2xl text-navy mt-4 mb-1">CV submissions</h1>
      <p className="text-sm text-slate mb-8">Candidates who filled out the CV builder at /cv.</p>

      {submissions.length === 0 ? (
        <div className="text-center py-12 text-slate border border-dashed border-line rounded">No CVs submitted yet.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {submissions.map((s) => (
            <Link
              key={s.id}
              href={`/admin/cv/${s.id}`}
              className="bg-white border border-line rounded p-4 flex justify-between items-center hover:shadow-md"
            >
              <div>
                <h4 className="font-display text-navy">{s.name}</h4>
                <p className="text-xs text-slate">
                  {s.role ? `${s.role} · ` : ''}
                  {s.createdAt.toLocaleString()}
                </p>
              </div>
              <span className="text-xs uppercase tracking-wide bg-paper border border-line rounded-full px-3 py-1 text-slate">{s.format}</span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
