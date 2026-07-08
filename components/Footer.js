import { getSettings } from '../lib/settings';
import { toWhatsAppLink } from '../lib/whatsapp';

export default async function Footer() {
  const settings = await getSettings().catch(() => ({
    siteName: 'OAATZ COSULT LTD',
    footerBlurb: "A global placement marketplace connecting candidates with verified international work opportunities.",
    contactEmail: 'info@example.com',
    contactWhatsapp: '',
    businessHours: 'Mon-Fri, 09:00-18:00',
  }));

  const waLink = toWhatsAppLink(settings.contactWhatsapp, `Hi ${settings.siteName}, I have a question.`);

  return (
    <footer className="bg-navydeep text-[#C9C9C9] px-6 pt-11 pb-6 mt-16">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-9">
        <div>
          <h4 className="text-white font-display text-base mb-3">{settings.siteName}</h4>
          <p className="text-sm max-w-[34ch]">{settings.footerBlurb}</p>
        </div>
        <div>
          <h4 className="text-white font-display text-base mb-3">Company</h4>
          <ul className="text-sm space-y-2">
            <li><a href="/#marketplace">Destinations</a></li>
            <li><a href="/contact">Contact us</a></li>
            <li><a href="/login">Log in</a></li>
            <li><a href="/affiliate/signup">Become a partner</a></li>
            <li><a href="/staff/login">Staff login</a></li>
            <li><a href="/admin/login">Admin</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-display text-base mb-3">Contact</h4>
          <ul className="text-sm space-y-2">
            <li><a href={`mailto:${settings.contactEmail}`} className="hover:text-white">{settings.contactEmail}</a></li>
            <li>
              {waLink ? (
                <a href={waLink} target="_blank" rel="noreferrer" className="hover:text-white">
                  WhatsApp: {settings.contactWhatsapp}
                </a>
              ) : (
                <span>WhatsApp: [Not set]</span>
              )}
            </li>
            <li>{settings.businessHours}</li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-8 pt-5 border-t border-white/10 text-xs text-[#8A8A8A] flex justify-between flex-wrap gap-2">
        <span>© {new Date().getFullYear()} {settings.siteName}. Demo checkout — no real payments are processed.</span>
      </div>
    </footer>
  );
}
