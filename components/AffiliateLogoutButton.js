'use client';

import { useRouter } from 'next/navigation';
import { affiliateLogoutAction } from '../actions/affiliates';

export default function AffiliateLogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => { await affiliateLogoutAction(); router.push('/affiliate/login'); router.refresh(); }}
      className="text-sm border border-line rounded px-4 py-2 text-red-700 font-semibold bg-white"
    >
      Log out
    </button>
  );
}
