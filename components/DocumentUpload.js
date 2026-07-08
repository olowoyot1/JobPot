'use client';

import { useState, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { uploadDocument, deleteDocument } from '../actions/documents';

const TYPES = [
  ['passport', 'Passport'],
  ['cv', 'CV / Resume'],
  ['certificate', 'Certificate'],
  ['photo', 'Passport Photo'],
  ['other', 'Other'],
];

const STATUS_STYLE = {
  pending: 'bg-[#F5E6BC] text-golddark',
  approved: 'bg-[#DCEEDC] text-teal',
  rejected: 'bg-red-50 text-red-700',
};

export default function DocumentUpload({ documents }) {
  const router = useRouter();
  const formRef = useRef(null);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData) {
    setError('');
    startTransition(async () => {
      const res = await uploadDocument(formData);
      if (res?.error) setError(res.error);
      else { formRef.current?.reset(); router.refresh(); }
    });
  }

  function handleDelete(id) {
    startTransition(async () => {
      await deleteDocument(id);
      router.refresh();
    });
  }

  return (
    <div className="bg-white border border-line rounded p-5">
      <h3 className="font-display text-lg text-navy mb-1">My documents</h3>
      <p className="text-xs text-slate mb-4">Upload your passport, CV, certificates, or photo for your application.</p>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded px-3 py-2 mb-3">{error}</div>}

      <form ref={formRef} action={handleSubmit} className="flex flex-wrap gap-2 mb-5">
        <select name="type" className="border border-line rounded px-2 py-2 bg-paper text-sm">
          {TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <input name="file" type="file" required className="text-sm flex-1 min-w-[160px]" />
        <button disabled={isPending} className="bg-gold text-navydeep text-sm font-semibold rounded px-4 py-2 hover:bg-amber disabled:opacity-60">
          {isPending ? 'Uploading…' : 'Upload'}
        </button>
      </form>

      {documents.length === 0 ? (
        <p className="text-sm text-slate">No documents uploaded yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {documents.map((d) => (
            <div key={d.id} className="flex items-center justify-between border-t border-line pt-2 text-sm">
              <div>
                <span className="font-medium capitalize">{d.type}</span>{' '}
                {d.viewUrl ? (
                  <a href={d.viewUrl} target="_blank" rel="noreferrer" className="text-golddark underline">{d.fileName}</a>
                ) : (
                  <span className="text-slate">{d.fileName}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-mono text-[10px] uppercase px-2 py-1 rounded-full ${STATUS_STYLE[d.status] || ''}`}>{d.status}</span>
                <button onClick={() => handleDelete(d.id)} disabled={isPending} className="text-xs text-red-600 font-semibold">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
