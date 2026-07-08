'use client';

import { useRouter } from 'next/navigation';
import { staffLogoutAction } from '../actions/staff';

export default function StaffLogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => { await staffLogoutAction(); router.push('/staff/login'); router.refresh(); }}
      className="text-sm border border-line rounded px-4 py-2 text-red-700 font-semibold bg-white"
    >
      Log out
    </button>
  );
}
