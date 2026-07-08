import { getSettings } from '../../lib/settings';
import { toWhatsAppLink } from '../../lib/whatsapp';
import ContactForm from '../../components/ContactForm';

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const settings = await getSettings();
  const waLink = toWhatsAppLink(settings.contactWhatsapp, `Hi ${settings.siteName}, I have a question.`);

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl text-navy mb-2">Get in touch</h1>
      <p className="text-slate text-sm mb-8">
        Questions about a destination, a package, or your application? Send us a message or reach us directly below.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <ContactForm />

        <div className="flex flex-col gap-4">
          <div className="bg-white border border-line rounded p-5">
            <h3 className="font-display text-navy mb-1">Email</h3>
            <a href={`mailto:${settings.contactEmail}`} className="text-golddark underline text-sm">{settings.contactEmail}</a>
          </div>
          {waLink && (
            <div className="bg-white border border-line rounded p-5">
              <h3 className="font-display text-navy mb-1">WhatsApp</h3>
              <a href={waLink} target="_blank" rel="noreferrer" className="text-golddark underline text-sm">
                {settings.contactWhatsapp}
              </a>
            </div>
          )}
          <div className="bg-white border border-line rounded p-5">
            <h3 className="font-display text-navy mb-1">Business hours</h3>
            <p className="text-sm text-slate">{settings.businessHours}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
