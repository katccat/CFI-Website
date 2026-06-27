import { useEffect, useState } from 'react'

const LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about/' },
  { label: 'Book a Lesson', href: '/booking/' },
  { label: 'Contact', href: '/contact/' },
  { label: 'Art', href: '/art/' },
]

// Matches the `is_portrait` breakpoint that script.js used for the old static nav.
const PORTRAIT_QUERY = '(max-width: 1024px)'

// Strip a trailing slash so "/about" and "/about/" compare equal (root stays "/").
function normalizePath(path) {
  const stripped = path.replace(/\/+$/, '')
  return stripped === '' ? '/' : stripped
}

export default function SiteNav({ currentPath }) {
  const active = normalizePath(currentPath)
  // Start in the desktop state so server-render (Astro builds islands on the
  // server, where `window` is undefined) and the client's first render agree;
  // the effect below corrects to the real viewport after hydration.
  const [portrait, setPortrait] = useState(false)
  // Whether the dropdown is expanded. Only meaningful in portrait; on desktop
  // the links are always shown via CSS.
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(PORTRAIT_QUERY)
    function handleChange() {
      setPortrait(mq.matches)
      // Collapse when shrinking to portrait; re-show when growing to desktop.
      setOpen(!mq.matches)
    }
    // Sync to the real viewport now (initial state assumes desktop for SSR),
    // then keep it in step on breakpoint changes.
    handleChange()
    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, [])

  const navClassName = ['', portrait && 'box-shadow', open && 'visible']
    .filter(Boolean)
    .join(' ')

  return (
    <header>
      <div id="topbar" className="box-shadow">
        <a href="/">
          <img
            src="/images/skychicken-blue.png"
            id="logo"
            height="72px"
            title="Damon Welber | Flight Training in Daytona Beach"
          />
        </a>
        <h1 id="title" className="special-gothic-expanded-one-regular">
          Damon Welber
        </h1>
        <button
          id="hamburger"
          className={`hamburger hamburger--slider${open ? ' active' : ''}`}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <div className="hamburger-box">
            <div className="hamburger-top"></div>
            <div className="hamburger-middle"></div>
            <div className="hamburger-bottom"></div>
          </div>
        </button>
        <nav id="nav-links" className={navClassName}>
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
      </div>
    </header>
  )
}
