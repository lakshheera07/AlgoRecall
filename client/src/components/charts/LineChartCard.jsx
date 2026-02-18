import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

function LineChartCard({
  title,
  data,
  xKey = 'label',
  dataKey,
  emptyMessage,
  statusMessage,
  statusTone = 'stable',
}) {
  return (
    <article className="problem-card analysis-chart-card">
      {title ? <h3>{title}</h3> : null}

      {data.length === 0 ? (
        <p>{emptyMessage}</p>
      ) : (
        <div className="analysis-chart-shell" role="img" aria-label={title}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 12, bottom: 6, left: 0 }}>
              <CartesianGrid stroke="var(--accent-green)" strokeDasharray="3 3" />
              <XAxis dataKey={xKey} stroke="var(--text-secondary)" tick={{ fontSize: 12 }} />
              <YAxis stroke="var(--text-secondary)" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--accent-green)',
                }}
              />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke="var(--primary-green)"
                strokeWidth={2}
                dot={{ fill: 'var(--secondary-green)', r: 3 }}
                activeDot={{ r: 5 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {statusMessage ? (
        <p className={`analysis-trend-status trend-${statusTone}`}>
          {statusMessage}
        </p>
      ) : null}
    </article>
  )
}

export default LineChartCard
