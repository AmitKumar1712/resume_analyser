export default function ScoreCard({ label, score, max = 100, tone = 'accent' }) {
  const percent = Math.min(100, Math.max(0, (score / max) * 100))

  return (
    <div className={`score-card ${tone}`}>
      <div className="score-ring">
        <span>{score}</span>
      </div>
      <div>
        <h4>{label}</h4>
        <p>Performance level: {percent.toFixed(0)}%</p>
      </div>
    </div>
  )
}
