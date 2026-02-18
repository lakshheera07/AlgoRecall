function MetricCard({ title, value, subtitle }) {
  return (
    <article className="problem-card metric-card">
      <p className="metric-card-title">{title}</p>
      <h3 className="metric-card-value">{value}</h3>
      {subtitle ? <p className="metric-card-subtitle">{subtitle}</p> : null}
    </article>
  )
}

export default MetricCard
