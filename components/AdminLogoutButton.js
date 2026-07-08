'use client';

import { useRouter } from 'next/navigation';
import { adminLogoutAction } from '../actions/auth';

export default function AdminLogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => { await adminLogoutAction(); router.push('/admin/login'); router.refresh(); }}
      className="text-sm border border-line rounded px-4 py-2 text-red-700 font-semibold bg-white"
    >
      Log out
    </button>
  );
}
