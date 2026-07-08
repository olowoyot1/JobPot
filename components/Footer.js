export default function Footer() {
  return (
    <footer className="bg-navydeep text-[#B9C4D3] px-6 pt-11 pb-6 mt-16">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-9">
        <div>
          <h4 className="text-white font-display text-base mb-3">OAATZ CONSULT LTD</h4>
          <p className="text-sm max-w-[34ch]">
            A global placement marketplace connecting candidates with verified international
            work opportunities. Replace with your company's real registration and contact details.
          </p>
        </div>
        <div>
          <h4 className="text-white font-display text-base mb-3">Company</h4>
          <ul className="text-sm space-y-2">
            <li><a href="/#marketplace">Destinations</a></li>
            <li><a href="/login">Log in</a></li>
            <li><a href="/admin/login">Admin</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-display text-base mb-3">Contact</h4>
          <ul className="text-sm space-y-2">
            <li>[email protected]</li>
            <li>WhatsApp: [Add number]</li>
            <li>Mon–Fri, 09:00–18:00</li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-8 pt-5 border-t border-white/10 text-xs text-[#7C8AA0] flex justify-between flex-wrap gap-2">
        <span>© {new Date().getFullYear()} OAATZ CONSULT LTD. Demo checkout — no real payments are processed.</span>
      </div>
    </footer>
  );
}
