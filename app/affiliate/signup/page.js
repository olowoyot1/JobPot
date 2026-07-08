'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { affiliateSignupAction } from '../../../actions/affiliates';

export default function AffiliateSignupPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData) {
    setError('');
    startTransition(async () => {
      const res = await affiliateSignupAction(formData);
      if (res?.error) setError(res.error);
      else { router.push('/affiliate'); router.refresh(); }
    });
  }

  return (
    <main className="max-w-md mx-auto px-6 py-16">
      <div className="bg-white border border-line rounded p-8">
        <h1 className="font-display text-2xl text-navy mb-1">Become a partner</h1>
        <p className="text-sm text-slate mb-6">
          Refer candidates with your own link and earn a commission on every package they buy.
        </p>
        <form action={handleSubmit} className="flex flex-col gap-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded px-3 py-2">{error}</div>}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink mb-1">Full name</label>
            <input name="name" required className="w-full border border-line rounded px-3 py-2.5 bg-paper text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink mb-1">Email</label>
            <input name="email" type="email" required className="w-full border border-line rounded px-3 py-2.5 bg-paper text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink mb-1">Password</label>
            <input name="password" type="password" required placeholder="Minimum 6 characters" className="w-full border border-line rounded px-3 py-2.5 bg-paper text-sm" />
          </div>
          <button disabled={isPending} className="bg-gold text-navydeep font-bold rounded py-3 hover:bg-amber disabled:opacity-60">
            {isPending ? 'Creating account…' : 'Create partner account'}
          </button>
          <p className="text-center text-sm text-slate">
            Already a partner? <Link href="/affiliate/login" className="text-golddark font-semibold underline">Log in</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
