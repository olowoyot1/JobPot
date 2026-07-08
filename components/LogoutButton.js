'use client';

import { useRouter } from 'next/navigation';
import { logoutAction } from '../actions/auth';

export default function LogoutButton({ variant = 'full' }) {
  const router = useRouter();
  const className =
    variant === 'nav'
      ? 'text-sm font-semibold px-4 py-2 rounded border border-white/30 hover:border-white text-white'
      : 'w-full bg-paper border border-line text-red-700 font-semibold rounded py-2.5 text-sm';

  return (
    <button
      onClick={async () => { await logoutAction(); router.push('/'); router.refresh(); }}
      className={className}
    >
      Log out
    </button>
  );
}
