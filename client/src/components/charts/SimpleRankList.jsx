function SimpleRankList({ title, items, emptyMessage, formatter }) {
  return (
    <article className="problem-card analysis-list-card">
      <h3>{title}</h3>

      {items.length === 0 ? (
        <p>{emptyMessage}</p>
      ) : (
        <ul className="analysis-rank-list">
          {items.map((item) => (
            <li key={item.name}>
              <span>{item.name}</span>
              <strong>{formatter(item)}</strong>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

export default SimpleRankList
