import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const PIE_COLORS = [
  'var(--primary-green)',
  'var(--secondary-green)',
  'var(--accent-green)',
  'var(--difficulty-medium)',
  'var(--difficulty-easy)',
]

function PieChartCard({ title, data, dataKey, nameKey = 'name', emptyMessage }) {
  return (
    <article className="problem-card analysis-chart-card">
      <h3>{title}</h3>

      {data.length === 0 ? (
        <p>{emptyMessage}</p>
      ) : (
        <div className="analysis-chart-shell" role="img" aria-label={title}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey={dataKey}
                nameKey={nameKey}
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
                isAnimationActive={false}
              >
                {data.map((item, index) => (
                  <Cell key={`slice-${item[nameKey]}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--accent-green)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </article>
  )
}

export default PieChartCard
