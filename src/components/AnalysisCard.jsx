export default function AnalysisCard({ title, value, icon, children }) {
  return (
    <article className="analysis-card">
      <div className="card-header">
        <span className="card-icon">{icon}</span>
        <h4>{title}</h4>
      </div>
      <div className="card-body">
        {typeof value === 'string' ? <p className="card-value">{value}</p> : null}
        {children}
      </div>
    </article>
  )
}
