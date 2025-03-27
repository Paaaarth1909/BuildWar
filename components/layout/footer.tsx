export function Footer() {
  return (
    <footer className="bg-muted py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Traffic Violation Reporter</h3>
            <p className="text-muted-foreground">
              A platform for citizens to report traffic violations and contribute to safer roads.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-muted-foreground hover:text-foreground">
                  Home
                </a>
              </li>
              <li>
                <a href="/report" className="text-muted-foreground hover:text-foreground">
                  Report Violation
                </a>
              </li>
              <li>
                <a href="/dashboard" className="text-muted-foreground hover:text-foreground">
                  My Reports
                </a>
              </li>
              <li>
                <a href="/faq" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-muted-foreground/20">
          <p className="text-center text-muted-foreground text-sm">
            © {new Date().getFullYear()} Traffic Violation Reporter. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

