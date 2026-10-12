import Link from "next/link";

/**
 * Footer — reusable across the whole app. Server component (ships zero JS,
 * aside from the embedded Newsletter client component).
 * Fonts come from the layout's next/font vars (no @import here).
 */
const QUICK_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

const SERVICE_LINKS = [
  { href: "/track", label: "Track Order" },
  { href: "/shipping", label: "Shipping Info" },
  { href: "/returns", label: "Return Policy" },
  { href: "/faq", label: "FAQ" },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        {/* Brand */}
        <div>
          <div className="footer-brand-name">ISSO TIME LUXURY</div>
          <p className="footer-brand-text">
            Timeless elegance for the modern connoisseur.
          </p>
          <p className="footer-brand-text footer-brand-text-spaced">
            Discover the finest luxury timepieces in Algeria.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <div className="footer-col-title">QUICK LINKS</div>
          <ul className="footer-links">
            {QUICK_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link href={href}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <div className="footer-col-title">CUSTOMER SERVICE</div>
          <ul className="footer-links">
            {SERVICE_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link href={href}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <div className="footer-col-title">CONTACT INFO</div>

          <div className="footer-contact-item">
            <svg className="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span>Algeria, Bordj Bou Arreridj</span>
          </div>

          <a className="footer-contact-item footer-contact-link" href="tel:+213791285842">
            <svg className="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.338c0-1.007.75-1.88 1.75-1.993A48.348 48.348 0 018.25 4.05c1 0 1.825.702 1.994 1.695L11 9.2a1.994 1.994 0 01-.616 1.978l-.814.7a16.034 16.034 0 006.552 6.552l.7-.815a1.994 1.994 0 011.978-.615l3.455.756A1.994 1.994 0 0123.95 19.75c-.113 1-.987 1.75-1.994 1.75h-.006a48.348 48.348 0 01-4.887-.245C7.5 20.755 3.245 16.5 2.495 10.187A48.348 48.348 0 012.25 6.344v-.006z" />
            </svg>
            <span>+213 791 285 842</span>
          </a>

          <a className="footer-contact-item footer-contact-link" href="mailto:issoutouati@gmail.com">
            <svg className="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            <span>issoutouati@gmail.com</span>
          </a>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <div className="footer-logo-area">
          <svg className="footer-logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
            <path d="M9 2.5 C9 1 10 0 12 0 C14 0 15 1 15 2.5" strokeLinecap="round" />
          </svg>
          <span className="footer-logo-name">ISSO TIME</span>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} ISSO TIME LUXURY. All rights reserved.</p>
      </div>

      <style>{`
        .site-footer {
          background: #080808;
          border-top: 1px solid #1e1800;
          padding: 60px 24px 0;
          font-family: var(--font-cormorant), serif;
        }
        .footer-grid {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
          gap: 40px;
          padding-bottom: 48px;
        }
        .footer-brand-name {
          font-family: var(--font-cinzel), serif;
          font-size: 0.82rem;
          letter-spacing: 0.18em;
          color: #c9a84c;
          margin-bottom: 14px;
        }
        .footer-brand-text {
          font-size: 0.95rem;
          line-height: 1.7;
          color: #9a8757; /* lifted from #7a6a3a for readability on near-black */
        }
        .footer-brand-text-spaced { margin-top: 14px; }
        .footer-col-title {
          font-family: var(--font-cinzel), serif;
          font-size: 0.78rem;
          letter-spacing: 0.18em;
          color: #c9a84c;
          margin-bottom: 18px;
        }
        .footer-links {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .footer-links a {
          color: #9a8757;
          text-decoration: none;
          font-size: 0.95rem;
          transition: color 0.2s;
        }
        .footer-links a:hover { color: #e8d5a3; }
        .footer-links a:focus-visible {
          outline: 1px solid #c9a84c;
          outline-offset: 3px;
          color: #e8d5a3;
        }
        .footer-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 14px;
          color: #9a8757;
          font-size: 0.95rem;
          line-height: 1.5;
        }
        .footer-contact-link { text-decoration: none; transition: color 0.2s; }
        .footer-contact-link:hover { color: #e8d5a3; }
        .footer-contact-link:focus-visible {
          outline: 1px solid #c9a84c;
          outline-offset: 3px;
          color: #e8d5a3;
        }
        .footer-contact-icon {
          color: #c9a84c;
          flex-shrink: 0;
          margin-top: 2px;
          width: 16px;
          height: 16px;
        }
        .footer-bottom {
          border-top: 1px solid #1e1800;
          padding: 28px 24px;
          text-align: center;
        }
        .footer-logo-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          margin-bottom: 16px;
        }
        .footer-logo-icon { width: 36px; height: 36px; color: #c9a84c; }
        .footer-logo-name {
          font-family: var(--font-cinzel), serif;
          font-size: 0.82rem;
          letter-spacing: 0.18em;
          color: #c9a84c;
        }
        .footer-copy {
          font-size: 0.82rem;
          color: #6a5a38; /* lifted from #3a3020 — old value was near-invisible */
          letter-spacing: 0.05em;
        }

        @media (max-width: 820px) {
          .footer-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 520px) {
          .footer-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </footer>
  );
}