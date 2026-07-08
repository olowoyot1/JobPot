import { getSettings } from '../lib/settings';
import { toWhatsAppLink } from '../lib/whatsapp';

export default async function WhatsAppButton() {
  const settings = await getSettings().catch(() => null);
  if (!settings) return null;

  const link = toWhatsAppLink(settings.contactWhatsapp, `Hi ${settings.siteName}, I have a question.`);
  if (!link) return null;

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 bg-teal text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:opacity-90"
    >
      <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.71.45 3.38 1.3 4.85L2 22l5.4-1.42a9.9 9.9 0 0 0 4.64 1.18h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 1.67c2.24 0 4.35.87 5.93 2.46a8.3 8.3 0 0 1 2.45 5.92c0 4.61-3.76 8.36-8.38 8.36a8.3 8.3 0 0 1-4.24-1.16l-.3-.18-3.2.84.85-3.12-.2-.32a8.25 8.25 0 0 1-1.27-4.42c0-4.61 3.76-8.38 8.36-8.38zm-3.3 4.3c-.17 0-.45.07-.68.32-.23.25-.9.87-.9 2.12s.92 2.46 1.05 2.63c.13.17 1.8 2.87 4.43 3.9 2.18.87 2.62.7 3.1.65.48-.05 1.53-.62 1.75-1.22.22-.6.22-1.11.15-1.22-.07-.11-.24-.17-.5-.3-.26-.13-1.53-.75-1.77-.84-.24-.09-.41-.13-.58.13-.17.26-.67.84-.82 1.01-.15.17-.3.19-.56.06-.26-.13-1.09-.4-2.08-1.28-.77-.68-1.29-1.53-1.44-1.79-.15-.26-.02-.4.11-.53.12-.12.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.06-.13-.58-1.42-.8-1.94-.21-.5-.42-.44-.58-.44z" />
      </svg>
    </a>
  );
}
