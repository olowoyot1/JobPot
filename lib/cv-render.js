function esc(s) {
  return (s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function skillsPills(str) {
  return (str || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => `<span style="display:inline-block;background:#F5E6BC;color:#8A6A00;font-size:11.5px;padding:3px 10px;border-radius:20px;margin:0 5px 5px 0;">${esc(s)}</span>`)
    .join('');
}

function expEntries(d) {
  return (
    (d.experience || [])
      .filter((x) => x.title || x.company)
      .map(
        (x) => `
      <div style="margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;font-size:13.5px;font-weight:600;gap:10px;">
          <span>${esc(x.title) || 'Role'}${x.company ? ' — ' + esc(x.company) : ''}</span><span>${esc(x.dates)}</span>
        </div>
        <div style="font-size:12.5px;line-height:1.5;color:#121212;">${esc(x.desc)}</div>
      </div>`
      )
      .join('') || '<p style="color:#5A5A5A;font-size:13px;font-style:italic;">No experience added yet.</p>'
  );
}

function eduEntries(d) {
  return (
    (d.education || [])
      .filter((x) => x.degree || x.school)
      .map(
        (x) => `
      <div style="margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;font-size:13.5px;font-weight:600;gap:10px;">
          <span>${esc(x.degree) || 'Qualification'}</span><span>${esc(x.year)}</span>
        </div>
        <div style="font-size:12px;color:#5A5A5A;">${esc(x.school)}</div>
      </div>`
      )
      .join('') || '<p style="color:#5A5A5A;font-size:13px;font-style:italic;">No education added yet.</p>'
  );
}

function headshotImg(d) {
  if (!d.includePhoto || !d.photoSrc) return '';
  return `<img src="${d.photoSrc}" style="width:86px;height:86px;border-radius:8px;object-fit:cover;background:#F8F6F0;flex-shrink:0;" />`;
}

function sectionHeading(text) {
  return `<div style="font-family:'Fraunces',serif;font-size:14px;text-transform:uppercase;letter-spacing:.08em;color:#2E7D32;border-bottom:1px solid #E3DED0;padding-bottom:4px;margin:18px 0 8px;">${text}</div>`;
}

function renderUK(d) {
  const contactBits = [d.email, d.phone, d.location].filter(Boolean).join('  ·  ');
  return `
    <div style="display:flex;gap:18px;align-items:flex-start;margin-bottom:6px;">
      ${headshotImg(d)}
      <div>
        <h1 style="font-family:'Fraunces',serif;font-size:26px;margin:0 0 2px;font-weight:700;color:#0A0A0A;">${esc(d.name) || 'Full name'}</h1>
        ${d.role ? `<div style="color:#B58900;font-size:13px;margin-bottom:10px;">${esc(d.role)}</div>` : ''}
        <div style="font-size:12px;color:#5A5A5A;">${esc(contactBits)}</div>
      </div>
    </div>
    ${d.summary ? sectionHeading('Personal statement') + `<div style="font-size:12.5px;line-height:1.5;">${esc(d.summary)}</div>` : ''}
    ${sectionHeading('Work experience')}${expEntries(d)}
    ${sectionHeading('Education')}${eduEntries(d)}
    ${d.skills ? sectionHeading('Key skills') + `<div>${skillsPills(d.skills)}</div>` : ''}
    ${d.languages ? sectionHeading('Languages') + `<div>${skillsPills(d.languages)}</div>` : ''}
  `;
}

function renderCanada(d) {
  const contactBits = [d.email, d.phone, d.location].filter(Boolean).join('  ·  ');
  return `
    <div style="display:flex;gap:18px;align-items:flex-start;margin-bottom:6px;">
      ${headshotImg(d)}
      <div>
        <h1 style="font-family:'Fraunces',serif;font-size:26px;margin:0 0 2px;font-weight:700;color:#0A0A0A;">${esc(d.name) || 'Full name'}</h1>
        ${d.role ? `<div style="color:#B58900;font-size:13px;margin-bottom:10px;">${esc(d.role)}</div>` : ''}
        <div style="font-size:12px;color:#5A5A5A;">${esc(contactBits)}</div>
      </div>
    </div>
    ${d.summary ? sectionHeading('Professional summary') + `<div style="font-size:12.5px;line-height:1.5;">${esc(d.summary)}</div>` : ''}
    ${sectionHeading('Professional experience')}${expEntries(d)}
    ${sectionHeading('Education')}${eduEntries(d)}
    ${d.skills ? sectionHeading('Skills') + `<div>${skillsPills(d.skills)}</div>` : ''}
    ${d.languages ? sectionHeading('Languages') + `<div>${skillsPills(d.languages)}</div>` : ''}
    <p style="color:#5A5A5A;font-size:13px;font-style:italic;margin-top:14px;">References available upon request.</p>
  `;
}

function renderDubai(d) {
  const contactBits = [d.email, d.phone, d.location].filter(Boolean).join('  ·  ');
  const personalRows = [
    d.dob ? `<div><b>Date of birth</b> ${esc(d.dob)}</div>` : '',
    d.nationality ? `<div><b>Nationality</b> ${esc(d.nationality)}</div>` : '',
    d.marital ? `<div><b>Marital status</b> ${esc(d.marital)}</div>` : '',
    d.visa ? `<div><b>Visa status</b> ${esc(d.visa)}</div>` : '',
  ]
    .filter(Boolean)
    .join('');
  return `
    <div style="display:flex;gap:18px;align-items:flex-start;margin-bottom:6px;">
      ${headshotImg(d)}
      <div>
        <h1 style="font-family:'Fraunces',serif;font-size:26px;margin:0 0 2px;font-weight:700;color:#0A0A0A;">${esc(d.name) || 'Full name'}</h1>
        ${d.role ? `<div style="color:#B58900;font-size:13px;margin-bottom:10px;">${esc(d.role)}</div>` : ''}
        <div style="font-size:12px;color:#5A5A5A;">${esc(contactBits)}</div>
      </div>
    </div>
    ${personalRows ? `<div style="background:#F8F6F0;border-radius:6px;padding:10px 12px;font-size:12px;color:#5A5A5A;margin:10px 0 4px;display:grid;grid-template-columns:1fr 1fr;gap:4px 14px;">${personalRows}</div>` : ''}
    ${
      d.objective
        ? sectionHeading('Career objective') + `<div style="font-size:12.5px;line-height:1.5;">${esc(d.objective)}</div>`
        : d.summary
        ? sectionHeading('Career objective') + `<div style="font-size:12.5px;line-height:1.5;">${esc(d.summary)}</div>`
        : ''
    }
    ${sectionHeading('Work experience')}${expEntries(d)}
    ${sectionHeading('Education')}${eduEntries(d)}
    ${d.skills ? sectionHeading('Skills') + `<div>${skillsPills(d.skills)}</div>` : ''}
    ${d.languages ? sectionHeading('Languages') + `<div>${skillsPills(d.languages)}</div>` : ''}
  `;
}

function renderEuropass(d) {
  const personal = [
    ['Address', d.location],
    ['Telephone', d.phone],
    ['Email', d.email],
    ['Date of birth', d.dob],
    ['Nationality', d.nationality],
  ].filter((r) => r[1]);
  const personalRows = personal.map((r) => `<tr><td style="color:#1B4F8C;width:150px;font-weight:600;padding:4px 6px;">${esc(r[0])}</td><td style="padding:4px 6px;">${esc(r[1])}</td></tr>`).join('');
  const langRows = (d.languages || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => `<tr><td style="color:#1B4F8C;width:150px;font-weight:600;padding:4px 6px;">Language</td><td style="padding:4px 6px;">${esc(s)}</td></tr>`)
    .join('');
  const sh = (text) => `<div style="font-weight:700;font-size:12.5px;text-transform:uppercase;letter-spacing:.06em;color:#fff;background:#1B4F8C;padding:5px 10px;margin:16px 0 8px;">${text}</div>`;
  return `
    <div>
      <div style="background:#1B4F8C;color:#fff;padding:20px 26px;display:flex;gap:18px;align-items:center;margin:-34px -30px 0;">
        ${headshotImg(d)}
        <div>
          <h1 style="font-family:'Fraunces',serif;font-size:26px;margin:0 0 2px;font-weight:700;color:#fff;">${esc(d.name) || 'Full name'}</h1>
          ${d.role ? `<div style="color:#CFE0F2;font-size:13px;">${esc(d.role)}</div>` : ''}
        </div>
      </div>
      <div style="padding:22px 0 0;">
        ${sh('Personal information')}
        <table style="width:100%;border-collapse:collapse;font-size:12.5px;margin-bottom:6px;">${personalRows}</table>
        ${d.summary || d.objective ? sh('Profile') + `<div style="font-size:12.5px;line-height:1.5;">${esc(d.objective || d.summary)}</div>` : ''}
        ${sh('Work experience')}${expEntries(d)}
        ${sh('Education and training')}${eduEntries(d)}
        ${d.skills ? sh('Personal skills') + `<div>${skillsPills(d.skills)}</div>` : ''}
        ${langRows ? sh('Languages') + `<table style="width:100%;border-collapse:collapse;font-size:12.5px;">${langRows}</table>` : ''}
      </div>
    </div>
  `;
}

function renderCvHtml(d, formatOverride) {
  const format = formatOverride || d.format || 'uk';
  if (format === 'canada') return renderCanada(d);
  if (format === 'dubai') return renderDubai(d);
  if (format === 'europass') return renderEuropass(d);
  return renderUK(d);
}

module.exports = { esc, skillsPills, expEntries, eduEntries, headshotImg, renderCvHtml };
