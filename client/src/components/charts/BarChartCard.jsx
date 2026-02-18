import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

function BarChartCard({ title, data, dataKey, xKey = 'name', emptyMessage }) {
  return (
    <article className="problem-card analysis-chart-card">
      <h3>{title}</h3>

      {data.length === 0 ? (
        <p>{emptyMessage}</p>
      ) : (
        <div className="analysis-chart-shell" role="img" aria-label={title}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 12, bottom: 6, left: 0 }}>
              <CartesianGrid stroke="var(--accent-green)" strokeDasharray="3 3" />
              <XAxis dataKey={xKey} stroke="var(--text-secondary)" tick={{ fontSize: 12 }} />
              <YAxis stroke="var(--text-secondary)" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--accent-green)',
                }}
              />
              <Bar dataKey={dataKey} fill="var(--secondary-green)" isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </article>
  )
}

export default BarChartCard
