'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginAction } from '../../actions/auth';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData) {
    setError('');
    startTransition(async () => {
      const res = await loginAction(formData);
      if (res?.error) setError(res.error);
      else router.push('/account');
    });
  }

  return (
    <main className="max-w-md mx-auto px-6 py-16">
      <div className="bg-white border border-line rounded p-8">
        <h1 className="font-display text-2xl text-navy mb-1">Welcome back</h1>
        <p className="text-sm text-slate mb-6">Log in to view destinations and manage your orders.</p>
        <form action={handleSubmit} className="flex flex-col gap-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded px-3 py-2">{error}</div>}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink mb-1">Email</label>
            <input name="email" type="email" required placeholder="you@example.com" className="w-full border border-line rounded px-3 py-2.5 bg-paper text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink mb-1">Password</label>
            <input name="password" type="password" required placeholder="Your password" className="w-full border border-line rounded px-3 py-2.5 bg-paper text-sm" />
          </div>
          <button disabled={isPending} className="bg-gold text-navydeep font-bold rounded py-3 hover:bg-amber disabled:opacity-60">
            {isPending ? 'Logging in…' : 'Log in'}
          </button>
          <p className="text-center text-sm text-slate">
            New here? <Link href="/signup" className="text-golddark font-semibold underline">Create a free account</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
