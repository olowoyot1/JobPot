'use client';

import { useState, useRef, useTransition } from 'react';
import { submitCvForm } from '../actions/cv';
import { renderCvHtml } from '../lib/cv-render';

const FORMATS = [
  ['uk', 'UK'],
  ['canada', 'Canada'],
  ['dubai', 'Dubai / UAE'],
  ['europass', 'Europass (EU)'],
];

const emptyExp = () => ({ title: '', company: '', dates: '', desc: '' });
const emptyEdu = () => ({ degree: '', school: '', year: '' });

export default function CvForm() {
  const formRef = useRef(null);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [format, setFormat] = useState('uk');
  const [includePhoto, setIncludePhoto] = useState(true);
  const [photoSrc, setPhotoSrc] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [summary, setSummary] = useState('');
  const [skills, setSkills] = useState('');
  const [languages, setLanguages] = useState('');
  const [dob, setDob] = useState('');
  const [nationality, setNationality] = useState('');
  const [marital, setMarital] = useState('');
  const [visa, setVisa] = useState('');
  const [objective, setObjective] = useState('');
  const [exp, setExp] = useState([emptyExp()]);
  const [edu, setEdu] = useState([emptyEdu()]);

  function handlePhotoFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 420;
        let w = img.width;
        let h = img.height;
        if (w > h && w > maxDim) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else if (h >= w && h > maxDim) {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        setPhotoSrc(canvas.toDataURL('image/jpeg', 0.85));
        canvas.toBlob((blob) => setPhotoFile(new File([blob], 'headshot.jpg', { type: 'image/jpeg' })), 'image/jpeg', 0.85);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function getData() {
    return {
      format,
      includePhoto,
      photoSrc,
      name,
      role,
      email,
      phone,
      location,
      summary,
      skills,
      languages,
      dob,
      nationality,
      marital,
      visa,
      objective,
      experience: exp,
      education: edu,
    };
  }

  function handleSubmit(fd) {
    setError('');
    if (!name.trim()) {
      setError('Please add a name before submitting.');
      return;
    }
    fd.set('format', format);
    fd.set('includePhoto', String(includePhoto));
    fd.set('name', name);
    fd.set('role', role);
    fd.set('email', email);
    fd.set('phone', phone);
    fd.set('location', location);
    fd.set('summary', summary);
    fd.set('skills', skills);
    fd.set('languages', languages);
    fd.set('dob', dob);
    fd.set('nationality', nationality);
    fd.set('marital', marital);
    fd.set('visa', visa);
    fd.set('objective', objective);
    fd.set('experience', JSON.stringify(exp));
    fd.set('education', JSON.stringify(edu));
    if (photoFile) fd.set('photo', photoFile);

    startTransition(async () => {
      const res = await submitCvForm(fd);
      if (res?.error) setError(res.error);
      else setSent(true);
    });
  }

  if (sent) {
    return (
      <div className="bg-white border border-line rounded p-10 text-center max-w-lg mx-auto">
        <div className="w-14 h-14 rounded-full border-2 border-teal text-teal flex items-center justify-center text-2xl mx-auto mb-3">✓</div>
        <h3 className="font-display text-lg text-navy mb-1">CV submitted</h3>
        <p className="text-sm text-slate">Thanks — your CV has been sent. You can close this page now.</p>
      </div>
    );
  }

  const labelClass = 'block text-xs font-semibold uppercase tracking-wide text-ink mb-1';
  const inputClass = 'w-full border border-line rounded px-3 py-2.5 bg-paper text-sm';

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <form ref={formRef} action={handleSubmit} className="flex flex-col gap-4">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded px-3 py-2">{error}</div>}

        <div>
          <label className={labelClass}>CV format</label>
          <select className={inputClass} value={format} onChange={(e) => setFormat(e.target.value)}>
            {FORMATS.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          {photoSrc ? (
            <img src={photoSrc} className="w-14 h-14 rounded object-cover border border-line" alt="" />
          ) : (
            <div className="w-14 h-14 rounded bg-paper border border-line flex items-center justify-center text-[10px] text-slate text-center">No photo</div>
          )}
          <div>
            <label className="inline-block border border-line rounded px-3 py-2 text-sm cursor-pointer hover:bg-paper">
              Upload headshot
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoFile(e.target.files[0])} />
            </label>
            <button
              type="button"
              className="ml-2 border border-line rounded px-3 py-2 text-sm hover:bg-paper"
              onClick={() => {
                setPhotoSrc(null);
                setPhotoFile(null);
              }}
            >
              Remove
            </button>
          </div>
        </div>
        <label className="flex items-center gap-2 text-xs text-slate -mt-2">
          <input type="checkbox" checked={includePhoto} onChange={(e) => setIncludePhoto(e.target.checked)} />
          Include photo on the generated CV
        </label>

        <div>
          <label className={labelClass}>Full name</label>
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Obi" />
        </div>
        <div>
          <label className={labelClass}>Target role / title</label>
          <input className={inputClass} value={role} onChange={(e) => setRole(e.target.value)} placeholder="Product Designer" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Email</label>
            <input className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ada@email.com" />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 800 000 0000" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Location</label>
          <input className={inputClass} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Lagos, Nigeria" />
        </div>
        <div>
          <label className={labelClass}>Professional summary</label>
          <textarea className={inputClass} rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="A short 2-3 sentence overview of your experience and strengths." />
        </div>

        <h3 className="font-display text-lg text-navy border-b border-line pb-1 mt-2">Work experience</h3>
        {exp.map((x, i) => (
          <div key={i} className="bg-white border border-line rounded p-4 relative">
            <button type="button" className="absolute top-2 right-3 text-slate text-lg" onClick={() => setExp(exp.filter((_, idx) => idx !== i))}>
              ×
            </button>
            <div className="grid grid-cols-2 gap-3 mb-2">
              <input className={inputClass} placeholder="Job title" value={x.title} onChange={(e) => updateEntry(setExp, exp, i, 'title', e.target.value)} />
              <input className={inputClass} placeholder="Company" value={x.company} onChange={(e) => updateEntry(setExp, exp, i, 'company', e.target.value)} />
            </div>
            <input className={inputClass + ' mb-2'} placeholder="2022 - Present" value={x.dates} onChange={(e) => updateEntry(setExp, exp, i, 'dates', e.target.value)} />
            <textarea className={inputClass} placeholder="What you did" rows={2} value={x.desc} onChange={(e) => updateEntry(setExp, exp, i, 'desc', e.target.value)} />
          </div>
        ))}
        <button type="button" className="self-start bg-[#DCEEDC] text-teal text-sm rounded px-3 py-2" onClick={() => setExp([...exp, emptyExp()])}>
          + Add experience
        </button>

        <h3 className="font-display text-lg text-navy border-b border-line pb-1 mt-2">Education</h3>
        {edu.map((x, i) => (
          <div key={i} className="bg-white border border-line rounded p-4 relative">
            <button type="button" className="absolute top-2 right-3 text-slate text-lg" onClick={() => setEdu(edu.filter((_, idx) => idx !== i))}>
              ×
            </button>
            <div className="grid grid-cols-2 gap-3 mb-2">
              <input className={inputClass} placeholder="Degree / certificate" value={x.degree} onChange={(e) => updateEntry(setEdu, edu, i, 'degree', e.target.value)} />
              <input className={inputClass} placeholder="Year" value={x.year} onChange={(e) => updateEntry(setEdu, edu, i, 'year', e.target.value)} />
            </div>
            <input className={inputClass} placeholder="School" value={x.school} onChange={(e) => updateEntry(setEdu, edu, i, 'school', e.target.value)} />
          </div>
        ))}
        <button type="button" className="self-start bg-[#DCEEDC] text-teal text-sm rounded px-3 py-2" onClick={() => setEdu([...edu, emptyEdu()])}>
          + Add education
        </button>

        <h3 className="font-display text-lg text-navy border-b border-line pb-1 mt-2">Skills and languages</h3>
        <div>
          <label className={labelClass}>Skills (comma separated)</label>
          <input className={inputClass} value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Figma, User research, HTML/CSS" />
        </div>
        <div>
          <label className={labelClass}>Languages (comma separated, level optional)</label>
          <input className={inputClass} value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="English (Fluent), French (Basic)" />
        </div>

        <h3 className="font-display text-lg text-navy border-b border-line pb-1 mt-2">Extra details</h3>
        <p className="text-xs text-slate -mt-2">Used by the Dubai / UAE and Europass formats. Leave blank to skip.</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Date of birth</label>
            <input className={inputClass} value={dob} onChange={(e) => setDob(e.target.value)} placeholder="12 May 1994" />
          </div>
          <div>
            <label className={labelClass}>Nationality</label>
            <input className={inputClass} value={nationality} onChange={(e) => setNationality(e.target.value)} placeholder="Nigerian" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Marital status</label>
            <input className={inputClass} value={marital} onChange={(e) => setMarital(e.target.value)} placeholder="Single" />
          </div>
          <div>
            <label className={labelClass}>Visa / residency status</label>
            <input className={inputClass} value={visa} onChange={(e) => setVisa(e.target.value)} placeholder="Visit visa" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Career objective (one line)</label>
          <input className={inputClass} value={objective} onChange={(e) => setObjective(e.target.value)} placeholder="Seeking a design role in a fast-growing Gulf startup" />
        </div>

        <button disabled={isPending} className="bg-gold text-navydeep font-bold rounded py-3 hover:bg-amber disabled:opacity-60 mt-2">
          {isPending ? 'Submitting…' : 'Submit CV'}
        </button>
        <p className="text-xs text-slate">Submitting sends this CV to the team. There's no download option here — that happens on their end.</p>
      </form>

      <div className="md:sticky md:top-20">
        <div className="bg-navy text-white font-display text-sm px-4 py-1.5 rounded-t inline-block">Live preview</div>
        <div className="bg-white border border-line rounded-b rounded-tr p-8 min-h-[400px]" dangerouslySetInnerHTML={{ __html: renderCvHtml(getData()) }} />
      </div>
    </div>
  );
}

function updateEntry(setter, list, index, key, value) {
  const next = list.slice();
  next[index] = { ...next[index], [key]: value };
  setter(next);
}
