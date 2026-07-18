'use client';

import { useState } from 'react';
import Script from 'next/script';
import { renderCvHtml } from '../lib/cv-render';

const FORMATS = [
  ['uk', 'UK'],
  ['canada', 'Canada'],
  ['dubai', 'Dubai / UAE'],
  ['europass', 'Europass (EU)'],
];

export default function CvAdminDetail({ data }) {
  const [format, setFormat] = useState(data.format || 'uk');
  const [ready, setReady] = useState(false);

  function downloadPdf() {
    if (!window.html2pdf) return;
    const el = document.getElementById('cv-admin-page');
    const filename = (data.name || 'cv').replace(/[^a-z0-9]+/gi, '_') + '_' + format + '.pdf';
    window
      .html2pdf()
      .set({ margin: 10, filename, html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } })
      .from(el)
      .save();
  }

  return (
    <div>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" onLoad={() => setReady(true)} />

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <label className="text-sm text-slate">Generate as</label>
        <select className="border border-line rounded px-3 py-2 text-sm" value={format} onChange={(e) => setFormat(e.target.value)}>
          {FORMATS.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
        <button disabled={!ready} onClick={downloadPdf} className="bg-gold text-navydeep font-semibold text-sm rounded px-4 py-2 hover:bg-amber disabled:opacity-60">
          {ready ? 'Download PDF' : 'Loading…'}
        </button>
      </div>

      <div className="bg-navy text-white font-display text-sm px-4 py-1.5 rounded-t inline-block">Preview — {FORMATS.find((f) => f[0] === format)?.[1]}</div>
      <div id="cv-admin-page" className="bg-white border border-line rounded-b rounded-tr p-8 max-w-2xl" dangerouslySetInnerHTML={{ __html: renderCvHtml(data, format) }} />
    </div>
  );
}
