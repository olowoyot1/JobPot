import Link from 'next/link';
import { getSettings } from '../../../lib/settings';
import { updateSettings } from '../../../actions/settings';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <main className="max-w-2xl mx-auto px-6 py-14">
      <Link href="/admin" className="text-sm text-golddark font-medium">← Admin home</Link>
      <h1 className="font-display text-2xl text-navy mt-4 mb-1">Site settings</h1>
      <p className="text-sm text-slate mb-8">
        Controls the brand name, tagline, and contact details shown in the header and footer across the whole site.
      </p>

      <div className="bg-white border border-line rounded p-6">
        <form action={updateSettings} className="grid md:grid-cols-2 gap-4">
          <Field label="Site name" name="siteName" defaultValue={settings.siteName} required />
          <Field label="Tagline" name="tagline" defaultValue={settings.tagline} />
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink mb-1">Footer description</label>
            <textarea name="footerBlurb" defaultValue={settings.footerBlurb} rows={3} className="w-full border border-line rounded px-3 py-2 bg-paper text-sm" />
          </div>
          <Field label="Contact email" name="contactEmail" type="email" defaultValue={settings.contactEmail} />
          <Field label="WhatsApp number" name="contactWhatsapp" defaultValue={settings.contactWhatsapp} placeholder="+44 7000 000000" />
          <Field label="Business hours" name="businessHours" defaultValue={settings.businessHours} />
          <button className="md:col-span-2 bg-navy text-white font-bold rounded py-3 hover:bg-navydeep">
            Save settings
          </button>
        </form>
      </div>
    </main>
  );
}

function Field({ label, name, type = 'text', placeholder, defaultValue, required }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wide text-ink mb-1">{label}</label>
      <input name={name} type={type} placeholder={placeholder} defaultValue={defaultValue} required={required} className="w-full border border-line rounded px-3 py-2.5 bg-paper text-sm" />
    </div>
  );
}
