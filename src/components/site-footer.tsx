export default function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-muted-foreground">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Andrian. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Andrianns"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary"
              aria-label="GitHub"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/andrianaji18"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary"
              aria-label="LinkedIn"
            >
              LinkedIn
            </a>
            <a href="mailto:andriannsk@gmail.com" className="hover:text-primary" aria-label="Email">
              Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
