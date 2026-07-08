'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createOrder } from '../actions/orders';

export default function BuyButton({ packageId, loggedIn, batches = [] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmation, setConfirmation] = useState(null);
  const [error, setError] = useState('');
  const [batchId, setBatchId] = useState(batches[0]?.id || '');

  if (!loggedIn) {
    return (
      <button
        onClick={() => router.push('/login')}
        className="bg-navy text-white text-sm font-semibold rounded px-4 py-2 hover:bg-navydeep"
      >
        Log in to buy
      </button>
    );
  }

  if (confirmation) {
    return (
      <div className="text-right">
        <div className="font-mono bg-navydeep text-amber text-xs rounded px-3 py-2 mb-1">{confirmation}</div>
        <button onClick={() => router.push('/account')} className="text-xs text-golddark font-semibold underline">
          View my orders
        </button>
      </div>
    );
  }

  return (
    <div className="text-right flex flex-col items-end gap-2">
      {batches.length > 0 && (
        <select
          value={batchId}
          onChange={(e) => setBatchId(e.target.value)}
          className="text-xs border border-line rounded px-2 py-1.5 bg-paper"
        >
          {batches.map((b) => (
            <option key={b.id} value={b.id}>{b.name} ({b.slotsLeft} left)</option>
          ))}
        </select>
      )}
      <button
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            setError('');
            const res = await createOrder(packageId, batchId || null);
            if (res.error) setError(res.error);
            else setConfirmation(res.ref);
          })
        }
        className="bg-gold text-navydeep text-sm font-semibold rounded px-4 py-2 hover:bg-amber disabled:opacity-60"
      >
        {isPending ? 'Processing…' : 'Buy package'}
      </button>
      {error && <div className="text-xs text-red-600 max-w-[200px]">{error}</div>}
    </div>
  );
}
