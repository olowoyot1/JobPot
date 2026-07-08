import Link from 'next/link';
import { prisma } from '../../../../lib/db';
import { updatePageBlock } from '../../../../actions/content';
import BlockForm from '../../../../components/BlockForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditBlockPage({ params }) {
  const { id } = await params;
  const block = await prisma.pageBlock.findUnique({ where: { id } });
  if (!block) notFound();

  return (
    <main className="max-w-3xl mx-auto px-6 py-14">
      <Link href="/admin/content" className="text-sm text-golddark font-medium">← All content blocks</Link>
      <h1 className="font-display text-2xl text-navy mt-4 mb-1">Edit section</h1>
      <p className="text-sm text-slate mb-8">Changes appear on the homepage immediately after saving.</p>

      <div className="bg-white border border-line rounded p-6">
        <BlockForm action={updatePageBlock.bind(null, block.id)} initial={block} submitLabel="Save changes" />
      </div>
    </main>
  );
}
