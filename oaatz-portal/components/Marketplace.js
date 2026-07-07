'use client';

import { useState } from 'react';
import Link from 'next/link';

const CAT_LABEL = { bilateral: 'Bilateral Agreement', schengen: 'EU Schengen', nonschengen: 'EU Non-Schengen' };

export default function Marketplace({ countries }) {
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  const filtered = countries.filter((c) => {
    const matchesCat = filter === 'all' || c.category === filter;
    const q = query.toLowerCase();
    const matchesQ = !q || c.name.toLowerCase().includes(q) || c.industries.toLowerCase().includes(q);
    return matchesCat && matchesQ;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-7">
        <div className="flex flex-wrap gap-2">
          {['all', 'bilateral', 'schengen', 'nonschengen'].map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`text-sm font-medium px-4 py-2 rounded-full border ${
                filter === key ? 'bg-navy text-white border-navy' : 'bg-white text-ink border-line'
              }`}
            >
              {key === 'all' ? 'All destinations' : CAT_LABEL[key]}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 border border-line bg-white rounded-full px-4 py-2 min-w-[230px]">
          <span>🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search country or industry…"
            className="border-none outline-none text-sm bg-transparent w-full"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-slate border border-dashed border-line rounded">
          No destinations match your search.
        </div>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))' }}>
          {filtered.map((c) => (
            <Link
              key={c.id}
              href={`/destinations/${c.id}`}
              className="bg-white border border-line rounded p-5 flex flex-col gap-2 hover:shadow-lg hover:-translate-y-0.5 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{c.flag}</span>
                <span className={`badge ${c.category}`}>{CAT_LABEL[c.category]}</span>
              </div>
              <h3 className="font-display text-xl text-navy mt-1">{c.name}</h3>
              <div className="font-mono text-xl font-semibold text-navy">
                {c.vacancies ? c.vacancies.toLocaleString() : 'Variable'}
                <small className="block font-body text-[10px] text-slate uppercase tracking-wide font-medium">Open vacancies</small>
              </div>
              <div className="text-sm text-slate">{c.salary}</div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {c.industries.split(',').map((t) => (
                  <span key={t} className="tag">{t.trim()}</span>
                ))}
              </div>
              <span className="mt-auto bg-navy text-white text-sm font-semibold rounded px-3 py-2 text-center hover:bg-navydeep">
                View packages →
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
