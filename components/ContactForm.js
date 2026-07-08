'use client';

import { useState, useTransition } from 'react';
import { sendContactMessage } from '../actions/contact';

export default function ContactForm() {
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData) {
    setError('');
    startTransition(async () => {
      const res = await sendContactMessage(formData);
      if (res?.error) setError(res.error);
      else setSent(true);
    });
  }

  if (sent) {
    return (
      <div className="bg-white border border-line rounded p-6 text-center">
        <div className="w-14 h-14 rounded-full border-2 border-teal text-teal flex items-center justify-center text-2xl mx-auto mb-3">✓</div>
        <h3 className="font-display text-lg text-navy mb-1">Message sent</h3>
        <p className="text-sm text-slate">We'll get back to you shortly. Check your email for a confirmation.</p>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="bg-white border border-line rounded p-6 flex flex-col gap-4">
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
        <label className="block text-xs font-semibold uppercase tracking-wide text-ink mb-1">Message</label>
        <textarea name="message" required rows={5} className="w-full border border-line rounded px-3 py-2.5 bg-paper text-sm" />
      </div>
      <button disabled={isPending} className="bg-gold text-navydeep font-bold rounded py-3 hover:bg-amber disabled:opacity-60">
        {isPending ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
