'use client';

import { useState, useEffect } from 'react';

export default function ReferralLink({ code }) {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(`${window.location.origin}/signup?ref=${code}`);
  }, [code]);

  function copy() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="bg-navy text-white rounded p-5 flex items-center justify-between gap-4 flex-wrap">
      <div>
        <div className="font-mono text-[10px] tracking-widest text-amber uppercase mb-1">Your referral link</div>
        <div className="font-mono text-sm break-all">{url || '…'}</div>
      </div>
      <button onClick={copy} className="bg-gold text-navydeep font-semibold text-sm px-4 py-2 rounded hover:bg-amber whitespace-nowrap">
        {copied ? 'Copied!' : 'Copy link'}
      </button>
    </div>
  );
}
