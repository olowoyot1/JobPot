'use client';

import { useEffect, useState } from 'react';

export default function DepartureBoard({ countries }) {
  const [index, setIndex] = useState(0);
  const [clock, setClock] = useState('');

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % Math.max(countries.length, 1)), 3200);
    const c = setInterval(() => setClock(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })), 1000);
    setClock(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    return () => { clearInterval(t); clearInterval(c); };
  }, [countries.length]);

  if (!countries.length) {
    return (
      <div className="bg-navydeep border border-white/10 rounded p-5 text-amber font-mono text-sm">
        No destinations yet — add one from the admin dashboard.
      </div>
    );
  }

  const rows = Array.from({ length: Math.min(5, countries.length) }, (_, i) => countries[(index + i) % countries.length]);

  return (
    <div className="bg-navydeep border border-white/10 rounded p-4 shadow-2xl">
      <div className="flex justify-between items-center font-mono text-[10px] tracking-[2px] text-amber uppercase mb-2 pb-2 border-b border-dashed border-amber/25">
        <span><span className="inline-block w-1.5 h-1.5 rounded-full bg-teal mr-1.5" />Departures — Live Vacancies</span>
        <span>{clock}</span>
      </div>
      {rows.map((c, i) => (
        <div key={c.id + i} className="grid grid-cols-[1fr_90px_100px] gap-2 py-2 font-mono text-[13px] text-amber border-b border-white/5 last:border-0">
          <span className="truncate">{c.flag} {c.name.toUpperCase()}</span>
          <span>{c.vacancies ? c.vacancies.toLocaleString() : 'VAR'} POS</span>
          <span className="text-teal font-semibold text-right">BOARDING</span>
        </div>
      ))}
    </div>
  );
}
