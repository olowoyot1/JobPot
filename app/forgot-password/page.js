'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { requestPasswordReset } from '../../actions/auth';

export default function ForgotPasswordPage() {
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData) {
    setError('');
    startTransition(async () => {
      const res = await requestPasswordReset(formData);
      if (res?.error) setError(res.error);
      else setSent(true);
    });
  }

  return (
    <main className="max-w-md mx-auto px-6 py-16">
      <div className="bg-white border border-line rounded p-8">
        <h1 className="font-display text-2xl text-navy mb-1">Reset your password</h1>
        <p className="text-sm text-slate mb-6">Enter your account email and we'll send you a reset link.</p>

        {sent ? (
          <div className="bg-[#DCEEDC] border border-teal/30 text-teal text-sm rounded px-3 py-3">
            If an account exists for that email, a reset link is on its way. Check your inbox (and spam folder).
          </div>
        ) : (
          <form action={handleSubmit} className="flex flex-col gap-4">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded px-3 py-2">{error}</div>}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-ink mb-1">Email</label>
              <input name="email" type="email" required className="w-full border border-line rounded px-3 py-2.5 bg-paper text-sm" />
            </div>
            <button disabled={isPending} className="bg-gold text-navydeep font-bold rounded py-3 hover:bg-amber disabled:opacity-60">
              {isPending ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-slate mt-5">
          <Link href="/login" className="text-golddark font-semibold underline">Back to log in</Link>
        </p>
      </div>
    </main>
  );
}
