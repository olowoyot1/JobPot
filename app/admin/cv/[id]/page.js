import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '../../../../lib/db';
import { getSignedViewUrl } from '../../../../lib/blob-signed-url';
import CvAdminDetail from '../../../../components/CvAdminDetail';

export const dynamic = 'force-dynamic';

export default async function AdminCvDetailPage({ params }) {
  const { id } = await params;
  const submission = await prisma.cvSubmission.findUnique({ where: { id } });
  if (!submission) notFound();

  const photoSrc = submission.photoUrl ? await getSignedViewUrl(submission.photoUrl) : null;

  return (
    <main className="max-w-5xl mx-auto px-6 py-14">
      <Link href="/admin/cv" className="text-sm text-golddark font-medium">
        ← CV submissions
      </Link>
      <h1 className="font-display text-2xl text-navy mt-4 mb-8">{submission.name}</h1>

      <CvAdminDetail
        data={{
          format: submission.format,
          includePhoto: submission.includePhoto,
          photoSrc,
          name: submission.name,
          role: submission.role,
          email: submission.email,
          phone: submission.phone,
          location: submission.location,
          summary: submission.summary,
          skills: submission.skills,
          languages: submission.languages,
          dob: submission.dob,
          nationality: submission.nationality,
          marital: submission.marital,
          visa: submission.visa,
          objective: submission.objective,
          experience: submission.experience || [],
          education: submission.education || [],
        }}
      />
    </main>
  );
}
