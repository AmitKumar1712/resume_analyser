export default function SuggestionsCard({ title, items, emptyText }) {
  const normalizedItems = Array.isArray(items) ? items : []

  return (
    <article className="analysis-card">
      <div className="card-header">
        <h4>{title}</h4>
      </div>
      <div className="card-body">
        {normalizedItems.length ? (
          <ul className="bullet-list">
            {normalizedItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="empty-state">{emptyText || 'No grammatical errors found.'}</p>
        )}
      </div>
    </article>
  )
}
