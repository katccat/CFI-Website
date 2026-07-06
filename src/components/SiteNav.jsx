import { useEffect, useRef, useState } from 'react'

const LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about/' },
  {
    label: 'Lessons',
    children: [
      { label: 'Accelerated Multi-Engine', href: '/lessons/accelerated-multi-engine/' },
    ],
  },
  { label: 'Book a Lesson', href: '/booking/' },
  { label: 'Contact', href: '/contact/' },
  { label: 'Art', href: '/art/' },
]

// Strip a trailing slash so "/about" and "/about/" compare equal (root stays "/").
function normalizePath(path) {
  const stripped = path.replace(/\/+$/, '')
  return stripped === '' ? '/' : stripped
}

// A dropdown parent is "active" when the current page is one of its children.
function isDropdownActive(link, active) {
  return !!link.children?.some((child) => normalizePath(child.href) === active)
}

export default function SiteNav({ currentPath }) {
  const active = normalizePath(currentPath)
  // Whether the mobile full-screen menu is open. The desktop nav is always
  // visible via CSS and is a separate element, so this state only drives the
  // mobile overlay and the hamburger animation.
  const [open, setOpen] = useState(false)
  // Which desktop dropdown is open (by label), or null. Hover opens it via CSS;
  // this state adds click/keyboard support for touch devices.
  const [openDropdown, setOpenDropdown] = useState(null)
  const navRef = useRef(null)

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

  // Close the desktop dropdown on outside click or Escape.
  useEffect(() => {
    if (!openDropdown) return
    function handlePointer(event) {
      if (navRef.current && !navRef.current.contains(event.target)) setOpenDropdown(null)
    }
    function handleKey(event) {
      if (event.key === 'Escape') setOpenDropdown(null)
    }
    document.addEventListener('pointerdown', handlePointer)
    window.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('pointerdown', handlePointer)
      window.removeEventListener('keydown', handleKey)
    }
  }, [openDropdown])

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
        <nav id="nav-links" ref={navRef}>
          {LINKS.map((link) =>
            link.children ? (
              <div
                key={link.label}
                className={`nav-dropdown${openDropdown === link.label ? ' open' : ''}`}
              >
                <button
                  type="button"
                  className={`nav-link nav-dropdown-toggle${isDropdownActive(link, active) ? ' active' : ''}`}
                  aria-haspopup="true"
                  aria-expanded={openDropdown === link.label}
                  onClick={() =>
                    setOpenDropdown((current) => (current === link.label ? null : link.label))
                  }
                >
                  {link.label}
                  <span className="nav-caret" aria-hidden="true"></span>
                </button>
                <div className="nav-dropdown-menu">
                  {link.children.map((child) => (
                    <a
                      key={child.href}
                      href={child.href}
                      className={`nav-dropdown-item${normalizePath(child.href) === active ? ' active' : ''}`}
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className={`nav-link${normalizePath(link.href) === active ? ' active' : ''}`}
              >
                {link.label}
              </a>
            )
          )}
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
          {LINKS.map((link) =>
            link.children ? (
              <li key={link.label} className="mobile-nav-group">
                <span className="mobile-nav-heading">{link.label}</span>
                <ul className="mobile-nav-sublist">
                  {link.children.map((child) => (
                    <li key={child.href}>
                      <a
                        href={child.href}
                        className={`mobile-nav-link mobile-nav-sublink${normalizePath(child.href) === active ? ' active' : ''}`}
                        tabIndex={open ? 0 : -1}
                        onClick={() => setOpen(false)}
                      >
                        {child.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
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
            )
          )}
        </ul>
      </nav>
    </header>
  )
}
