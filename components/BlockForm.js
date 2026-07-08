'use client';

import { useState, useTransition } from 'react';
import { uploadBlockImage } from '../actions/content';

const TYPES = [
  ['hero', 'Hero (top banner)'],
  ['steps', 'Steps ("How it works")'],
  ['richtext', 'Rich text'],
  ['cta', 'Call-to-action banner'],
  ['image_text', 'Image + text'],
  ['html', 'Raw HTML'],
];

const BODY_HINTS = {
  hero: 'Not used for hero — see subtitle above.',
  steps: 'One step per line, format: Title :: Description',
  richtext: 'Main paragraph text.',
  cta: 'Optional short supporting text (shown as subtitle above instead).',
  image_text: 'Main paragraph text next to the image.',
  html: 'Raw HTML — rendered as-is. Only paste HTML you trust.',
};

export default function BlockForm({ action, initial = {}, submitLabel = 'Save' }) {
  const [type, setType] = useState(initial.type || 'richtext');
  const [imageUrl, setImageUrl] = useState(initial.imageUrl || '');
  const [uploadError, setUploadError] = useState('');
  const [isUploading, startUpload] = useTransition();

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');
    const fd = new FormData();
    fd.append('file', file);
    startUpload(async () => {
      const res = await uploadBlockImage(fd);
      if (res.error) setUploadError(res.error);
      else setImageUrl(res.url);
    });
  }

  return (
    <form action={action} className="grid md:grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-ink mb-1">Block type</label>
        <select name="type" value={type} onChange={(e) => setType(e.target.value)} className="w-full border border-line rounded px-3 py-2.5 bg-paper text-sm">
          {TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>
      <div />

      <Field label="Title" name="title" defaultValue={initial.title} />
      <Field label="Subtitle" name="subtitle" defaultValue={initial.subtitle} />

      <div className="md:col-span-2">
        <label className="block text-xs font-semibold uppercase tracking-wide text-ink mb-1">Body</label>
        <textarea name="body" defaultValue={initial.body} rows={5} className="w-full border border-line rounded px-3 py-2 bg-paper text-sm" />
        <p className="text-xs text-slate mt-1">{BODY_HINTS[type]}</p>
      </div>

      {(type === 'hero' || type === 'cta') && (
        <>
          <Field label="Button label" name="ctaLabel" defaultValue={initial.ctaLabel} placeholder="Browse destinations" />
          <Field label="Button link" name="ctaHref" defaultValue={initial.ctaHref} placeholder="#marketplace or /signup" />
        </>
      )}

      {type === 'hero' && (
        <>
          <Field label="Second button label (optional)" name="secondaryCtaLabel" defaultValue={initial.secondaryCtaLabel} />
          <Field label="Second button link" name="secondaryCtaHref" defaultValue={initial.secondaryCtaHref} />
        </>
      )}

      {type === 'image_text' && (
        <>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink mb-1">Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm" />
            {isUploading && <p className="text-xs text-slate mt-1">Uploading…</p>}
            {uploadError && <p className="text-xs text-red-600 mt-1">{uploadError}</p>}
            {imageUrl && <img src={imageUrl} alt="" className="mt-2 h-20 rounded border border-line" />}
            <input type="hidden" name="imageUrl" value={imageUrl} />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink mb-1">Image position</label>
            <select name="imagePosition" defaultValue={initial.imagePosition || 'right'} className="w-full border border-line rounded px-3 py-2.5 bg-paper text-sm">
              <option value="right">Image on right</option>
              <option value="left">Image on left</option>
            </select>
          </div>
        </>
      )}

      <button className="md:col-span-2 bg-navy text-white font-bold rounded py-3 hover:bg-navydeep">
        {submitLabel}
      </button>
    </form>
  );
}

function Field({ label, name, defaultValue, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wide text-ink mb-1">{label}</label>
      <input name={name} defaultValue={defaultValue} placeholder={placeholder} className="w-full border border-line rounded px-3 py-2.5 bg-paper text-sm" />
    </div>
  );
}
