'use client';

import { useRouter } from 'next/navigation';
import { logoutAction } from '../actions/auth';

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => { await logoutAction(); router.push('/'); router.refresh(); }}
      className="w-full bg-paper border border-line text-red-700 font-semibold rounded py-2.5 text-sm"
    >
      Log out
    </button>
  );
}
