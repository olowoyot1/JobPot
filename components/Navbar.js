import Link from 'next/link';
import { getCurrentUser } from '../lib/require-user';
import { getSettings } from '../lib/settings';

export default async function Navbar() {
  const [user, settings] = await Promise.all([
    getCurrentUser().catch(() => null),
    getSettings().catch(() => ({ siteName: 'OAATZ COSULT LTD', tagline: 'Global Placement Marketplace' })),
  ]);

  return (
    <nav className="sticky top-0 z-50 bg-navy text-white border-b-[3px] border-gold px-6 py-3 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center font-display font-bold text-navydeep text-sm">
          {settings.siteName.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <div className="font-display font-bold text-lg leading-none">{settings.siteName}</div>
          <div className="font-mono text-[10px] tracking-[2px] text-amber uppercase">{settings.tagline}</div>
        </div>
      </Link>
      <div className="hidden md:flex items-center gap-6 text-sm">
        <Link href="/#marketplace" className="opacity-80 hover:opacity-100">Destinations</Link>
        {user && <Link href="/account" className="opacity-80 hover:opacity-100">My Account</Link>}
      </div>
      <div>
        {user ? (
          <Link href="/account" className="bg-white/10 border border-white/30 text-sm px-4 py-2 rounded">
            👋 {user.name.split(' ')[0]}
          </Link>
        ) : (
          <Link href="/signup" className="bg-gold text-navydeep font-semibold text-sm px-4 py-2 rounded hover:bg-amber">
            Create free account
          </Link>
        )}
      </div>
    </nav>
  );
}
