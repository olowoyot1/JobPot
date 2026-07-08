'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { adminLoginAction } from '../../../actions/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData) {
    setError('');
    startTransition(async () => {
      const res = await adminLoginAction(formData);
      if (res?.error) setError(res.error);
      else { router.push('/admin'); router.refresh(); }
    });
  }

  return (
    <main className="max-w-md mx-auto px-6 py-16">
      <div className="bg-white border border-line rounded p-8">
        <h1 className="font-display text-2xl text-navy mb-1">Admin sign in</h1>
        <p className="text-sm text-slate mb-6">Manage destinations, packages and orders.</p>
        <form action={handleSubmit} className="flex flex-col gap-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded px-3 py-2">{error}</div>}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink mb-1">Admin email</label>
            <input name="email" type="email" required className="w-full border border-line rounded px-3 py-2.5 bg-paper text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink mb-1">Password</label>
            <input name="password" type="password" required className="w-full border border-line rounded px-3 py-2.5 bg-paper text-sm" />
          </div>
          <button disabled={isPending} className="bg-navy text-white font-bold rounded py-3 hover:bg-navydeep disabled:opacity-60">
            {isPending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  );
}
