import Link from 'next/link';
import { prisma } from '../../../lib/db';
import { createPageBlock, deletePageBlock, toggleBlockVisible, moveBlock } from '../../../actions/content';
import BlockForm from '../../../components/BlockForm';

export const dynamic = 'force-dynamic';

const TYPE_LABEL = {
  hero: 'Hero',
  steps: 'Steps',
  richtext: 'Rich text',
  cta: 'Call-to-action',
  image_text: 'Image + text',
  html: 'Raw HTML',
};

export default async function AdminContentPage() {
  const blocks = await prisma.pageBlock.findMany({ orderBy: { order: 'asc' } });

  return (
    <main className="max-w-3xl mx-auto px-6 py-14">
      <Link href="/admin" className="text-sm text-golddark font-medium">← Admin home</Link>
      <h1 className="font-display text-2xl text-navy mt-4 mb-1">Homepage content</h1>
      <p className="text-sm text-slate mb-8">
        These blocks render in order at the top of the homepage, above the fixed stats bar and marketplace grid.
        Add, reorder, hide, or delete sections freely.
      </p>

      <div className="flex flex-col gap-3 mb-10">
        {blocks.map((b, i) => (
          <div key={b.id} className="bg-white border border-line rounded p-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-wide bg-paper border border-line px-2 py-1 rounded-full">
                  {TYPE_LABEL[b.type] || b.type}
                </span>
                <h4 className="font-display text-navy">{b.title || <span className="italic text-slate">Untitled block</span>}</h4>
                {!b.visible && <span className="text-xs font-semibold text-red-600">Hidden</span>}
              </div>
              <div className="flex items-center gap-2">
                <form action={moveBlock.bind(null, b.id, 'up')}>
                  <button disabled={i === 0} className="text-xs border border-line rounded px-2 py-1 disabled:opacity-30">↑</button>
                </form>
                <form action={moveBlock.bind(null, b.id, 'down')}>
                  <button disabled={i === blocks.length - 1} className="text-xs border border-line rounded px-2 py-1 disabled:opacity-30">↓</button>
                </form>
                <form action={toggleBlockVisible.bind(null, b.id, !b.visible)}>
                  <button className="text-xs font-semibold text-golddark underline">{b.visible ? 'Hide' : 'Show'}</button>
                </form>
                <Link href={`/admin/content/${b.id}`} className="text-xs font-semibold text-golddark underline">Edit</Link>
                <form action={deletePageBlock.bind(null, b.id)}>
                  <button className="text-xs font-semibold text-red-700">Delete</button>
                </form>
              </div>
            </div>
          </div>
        ))}
        {blocks.length === 0 && (
          <div className="text-center py-8 text-slate border border-dashed border-line rounded">
            No content blocks yet — the homepage will show only the stats bar and marketplace until you add one below.
          </div>
        )}
      </div>

      <div className="bg-white border border-line rounded p-6">
        <h3 className="font-display text-lg text-navy mb-4">Add a new section</h3>
        <BlockForm action={createPageBlock} submitLabel="Add section" />
      </div>
    </main>
  );
}
