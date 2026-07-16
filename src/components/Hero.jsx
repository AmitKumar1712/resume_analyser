export default function Hero({ onUploadClick, onAnalyzeClick, hasFile, isAnalyzing }) {
  return (
    <section className="hero-card">
      <div className="hero-copy">
        <p className="eyebrow">AI-powered resume intelligence</p>
        <h2>Turn every resume into a hiring advantage.</h2>
        <p>
          Get instant scoring, ATS insights, grammar checks, and role-specific recommendations in a polished dashboard.
        </p>
        <div className="hero-actions">
          <button className="primary-btn" onClick={onUploadClick} type="button">
            Upload Resume
          </button>
          <button className="secondary-btn" onClick={onAnalyzeClick} type="button" disabled={!hasFile || isAnalyzing}>
            {isAnalyzing ? 'Analyzing…' : 'Analyze Resume'}
          </button>
        </div>
        <ul className="hero-highlights">
          <li>PDF, DOC, and DOCX support</li>
          <li>ATS-friendly keyword review</li>
          <li>Career roadmap suggestions</li>
        </ul>
      </div>
      <div className="hero-panel">
        <div className="panel-blob" />
        <div className="panel-card">
          <p className="eyebrow">Live report preview</p>
          <h3>87/100 Resume score</h3>
          <div className="mini-progress">
            <span style={{ width: '87%' }} />
          </div>
          <p>Strong structure, sharper keyword targeting, and measurable achievements will boost your match rate.</p>
        </div>
      </div>
    </section>
  )
}
