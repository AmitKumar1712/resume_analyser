import { useMemo } from 'react'

export default function Navbar({ theme, onToggleTheme }) {
  const brand = useMemo(() => (theme === 'dark' ? 'AI Resume Analyzer' : 'AI Resume Analyzer'), [theme])

  return (
    <header className="topbar">
      <div className="brand-group">
        <div className="brand-badge">✦</div>
        <div>
          <p className="eyebrow">Next-gen hiring toolkit</p>
          <h1>{brand}</h1>
        </div>
      </div>
      <nav className="topnav">
        <a href="#features">Features</a>
        <a href="#insights">Insights</a>
        <a href="#footer">Contact</a>
        <button className="ghost-btn" onClick={onToggleTheme} type="button">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </nav>
    </header>
  )
}
