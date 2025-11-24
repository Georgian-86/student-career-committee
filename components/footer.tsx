export default function Footer() {
  return (
    <footer className="bg-secondary/50 border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="group">
            <h3 className="font-bold mb-4 group-hover:text-primary transition-colors">SCC</h3>
            <p className="text-sm text-muted group-hover:text-foreground transition-colors">
              Empowering students through career opportunities and mentorship.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/about"
                  className="text-muted hover:text-primary transition-colors inline-flex items-center gap-1 group"
                >
                  About
                  <span className="inline-block w-0 group-hover:w-4 transition-all overflow-hidden">→</span>
                </a>
              </li>
              <li>
                <a
                  href="/events"
                  className="text-muted hover:text-primary transition-colors inline-flex items-center gap-1 group"
                >
                  Events
                  <span className="inline-block w-0 group-hover:w-4 transition-all overflow-hidden">→</span>
                </a>
              </li>
              <li>
                <a
                  href="/team"
                  className="text-muted hover:text-primary transition-colors inline-flex items-center gap-1 group"
                >
                  Team
                  <span className="inline-block w-0 group-hover:w-4 transition-all overflow-hidden">→</span>
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Follow Us</h4>
            <ul className="space-y-2 text-sm">
              {[
                { name: "LinkedIn", url: "https://linkedin.com" },
                { name: "Instagram", url: "https://instagram.com" },
                { name: "Twitter", url: "https://twitter.com" },
              ].map((social) => (
                <li key={social.name}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    {social.name}
                    <span className="inline-block w-0 group-hover:w-4 transition-all overflow-hidden">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Contact</h4>
            <p className="text-sm text-muted group hover:text-primary transition-colors">
              Email: scc@scse.lpu.in
              <br />
              Phone: +91 XXXXX XXXXX
            </p>
          </div>
        </div>
        <div className="border-t border-border pt-8">
          <p className="text-center text-sm text-muted hover:text-foreground transition-colors">
            © 2025 Student Career Committee, SCSE LPU. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
