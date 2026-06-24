import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border/60 bg-surface-container-low mt-24">
      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="text-2xl font-extrabold tracking-tight text-primary">
              LuxeCart
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">
              Minimalist Excellence. Redefining high-end technology for the modern professional.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { icon: "public", href: "https://luxeCart.example.com", label: "Website" },
                { icon: "photo_camera", href: "https://instagram.com/luxeCart", label: "Instagram" },
                { icon: "location_on", href: "https://maps.google.com/?q=LuxeCart+Store", label: "Find a store" },
              ].map((s) => (
                <a
                  key={s.icon}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition-all hover:border-primary hover:text-primary"
                >
                  <span className="material-icon text-[18px]">{s.icon}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Support</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Shipping</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Information</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Store Locator</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Press</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2024 LuxeCart. Minimalist Excellence.</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="material-icon text-[16px]">language</span>
            <span>English (US)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
