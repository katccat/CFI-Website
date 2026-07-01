import { useEffect, useState } from 'react'

const LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about/' },
  { label: 'Book a Lesson', href: '/booking/' },
  { label: 'Contact', href: '/contact/' },
  { label: 'Art', href: '/art/' },
]

// Strip a trailing slash so "/about" and "/about/" compare equal (root stays "/").
function normalizePath(path) {
  const stripped = path.replace(/\/+$/, '')
  return stripped === '' ? '/' : stripped
}

export default function SiteNav({ currentPath }) {
  const active = normalizePath(currentPath)
  // Whether the mobile full-screen menu is open. The desktop nav is always
  // visible via CSS and is a separate element, so this state only drives the
  // mobile overlay and the hamburger animation.
  const [open, setOpen] = useState(false)

  // Lock body scroll and allow Escape to close while the mobile menu is open.
  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function handleKey(event) {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKey)
    }
  }, [open])

  return (
    <header>
      <div id="topbar" className="box-shadow">
        <img
          src="/images/skychicken-blue.png"
          id="logo"
          height="72px"
          title="Damon Welber | Flight Training in Daytona Beach"
        />
        <a className="no-decoration title" href="/">
          <h1 className="title">Damon Welber CFI</h1>
        </a>

        {/* Desktop navigation — always present, hidden on mobile via CSS. */}
        <nav id="nav-links">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`nav-link${normalizePath(link.href) === active ? ' active' : ''}`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile hamburger — hidden on desktop via CSS. */}
        <button
          id="hamburger"
          className={`hamburger hamburger--slider${open ? ' active' : ''}`}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <div className="hamburger-box">
            <div className="hamburger-top"></div>
            <div className="hamburger-middle"></div>
            <div className="hamburger-bottom"></div>
          </div>
        </button>
      </div>

      {/* Mobile full-screen menu — a separate nav from the desktop links. */}
      <nav
        id="mobile-menu"
        className={open ? 'open' : ''}
        aria-hidden={!open}
      >
        <ul className="mobile-nav-list">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`mobile-nav-link${normalizePath(link.href) === active ? ' active' : ''}`}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
