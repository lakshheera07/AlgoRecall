import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Add Problem', to: '/add' },
  { label: 'Problem List', to: '/problems' },
]

const socialItems = [
  { label: 'Instagram', short: 'IG', href: '#' },
  { label: 'Twitter/X', short: 'X', href: '#' },
  { label: 'LinkedIn', short: 'IN', href: '#' },
]

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <h1 className="brand" onClick={() => window.location.href = '/'}>AlgoRecall</h1>
        <nav className="navbar-links" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link-active' : 'nav-link'
              }
              end={item.to === '/'}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="navbar-socials">
        {socialItems.map((item) => (
          <a key={item.label} href={item.href} className="social-icon" aria-label={item.label}>
            {item.short}
          </a>
        ))}
      </div>
    </header>
  )
}

export default Navbar