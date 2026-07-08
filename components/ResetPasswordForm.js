'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { resetPassword } from '../actions/auth';

export default function ResetPasswordForm({ token }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData) {
    setError('');
    startTransition(async () => {
      const res = await resetPassword(formData);
      if (res?.error) setError(res.error);
      else setDone(true);
    });
  }

  if (done) {
    return (
      <div className="flex flex-col gap-4">
        <div className="bg-[#DCEEDC] border border-teal/30 text-teal text-sm rounded px-3 py-3">
          Your password has been reset. You can now log in with your new password.
        </div>
        <button onClick={() => router.push('/login')} className="bg-gold text-navydeep font-bold rounded py-3 hover:bg-amber">
          Go to log in
        </button>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded px-3 py-2">{error}</div>}
      <input type="hidden" name="token" value={token} />
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-ink mb-1">New password</label>
        <input name="password" type="password" required placeholder="Minimum 6 characters" className="w-full border border-line rounded px-3 py-2.5 bg-paper text-sm" />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-ink mb-1">Confirm new password</label>
        <input name="confirmPassword" type="password" required className="w-full border border-line rounded px-3 py-2.5 bg-paper text-sm" />
      </div>
      <button disabled={isPending} className="bg-gold text-navydeep font-bold rounded py-3 hover:bg-amber disabled:opacity-60">
        {isPending ? 'Resetting…' : 'Reset password'}
      </button>
      <p className="text-center text-sm text-slate">
        <Link href="/login" className="text-golddark font-semibold underline">Back to log in</Link>
      </p>
    </form>
  );
}
