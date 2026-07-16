export default function SkillsCard({ title, items, emptyText }) {
  return (
    <article className="analysis-card">
      <div className="card-header">
        <h4>{title}</h4>
      </div>
      <div className="card-body">
        {items?.length ? (
          <div className="chip-list">
            {items.map((item) => (
              <span className="chip" key={item}>{item}</span>
            ))}
          </div>
        ) : (
          <p>{emptyText}</p>
        )}
      </div>
    </article>
  )
}
