'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signupAction } from '../actions/auth';

export default function SignupForm({ countries }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData) {
    setError('');
    startTransition(async () => {
      const res = await signupAction(formData);
      if (res?.error) setError(res.error);
      else router.push('/account');
    });
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded px-3 py-2">{error}</div>}
      <Field label="Full name" name="name" placeholder="e.g. Amara Okonkwo" />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Email" name="email" type="email" placeholder="you@example.com" />
        <Field label="Phone" name="phone" placeholder="+234…" />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-ink mb-1">Preferred destination (optional)</label>
        <select name="preferred" className="w-full border border-line rounded px-3 py-2.5 bg-paper text-sm">
          <option value="">No preference yet</option>
          {countries.map((c) => (
            <option key={c.id} value={c.name}>{c.flag} {c.name}</option>
          ))}
        </select>
      </div>
      <Field label="Password" name="password" type="password" placeholder="Minimum 6 characters" />
      <button disabled={isPending} className="bg-gold text-navydeep font-bold rounded py-3 hover:bg-amber disabled:opacity-60">
        {isPending ? 'Creating account…' : 'Create account'}
      </button>
      <p className="text-center text-sm text-slate">
        Already have an account? <Link href="/login" className="text-golddark font-semibold underline">Log in</Link>
      </p>
    </form>
  );
}

function Field({ label, name, type = 'text', placeholder }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wide text-ink mb-1">{label}</label>
      <input name={name} type={type} placeholder={placeholder} required={name !== 'phone'} className="w-full border border-line rounded px-3 py-2.5 bg-paper text-sm" />
    </div>
  );
}
