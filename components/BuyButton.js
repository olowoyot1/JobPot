'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createOrder } from '../actions/orders';

export default function BuyButton({ packageId, loggedIn }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmation, setConfirmation] = useState(null);
  const [error, setError] = useState('');

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
    <div className="text-right">
      <button
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            setError('');
            const res = await createOrder(packageId);
            if (res.error) setError(res.error);
            else setConfirmation(res.ref);
          })
        }
        className="bg-gold text-navydeep text-sm font-semibold rounded px-4 py-2 hover:bg-amber disabled:opacity-60"
      >
        {isPending ? 'Processing…' : 'Buy package'}
      </button>
      {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
    </div>
  );
}
