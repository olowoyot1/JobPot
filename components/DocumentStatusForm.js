'use client';

import { useTransition } from 'react';
import { updateDocumentStatus } from '../actions/documents';

const STATUSES = ['pending', 'approved', 'rejected'];

export default function DocumentStatusForm({ docId, status }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(e) => startTransition(() => updateDocumentStatus(docId, e.target.value))}
      className="text-xs font-mono uppercase border border-line rounded-full px-3 py-1.5 bg-paper"
    >
      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}
