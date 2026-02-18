import { useEffect, useState } from 'react'
import { fetchAnalysisInsightsApi } from '../api/problemsApi'
import BarChartCard from '../components/charts/BarChartCard'
import LineChartCard from '../components/charts/LineChartCard'
import MetricCard from '../components/charts/MetricCard'
import PieChartCard from '../components/charts/PieChartCard'
import SimpleRankList from '../components/charts/SimpleRankList'

function AnalysisPage() {
  const [analysisData, setAnalysisData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadAnalysis() {
      try {
        setIsLoading(true)
        setErrorMessage('')

        const insights = await fetchAnalysisInsightsApi()

        if (isMounted) {
          setAnalysisData(insights)
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message || 'Failed to load analysis')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadAnalysis()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="page-section">
      <h2>Preparation Analysis</h2>
      <p>Visual overview of your DSA practice, revision activity, and confidence trends.</p>

      {isLoading ? <p>Loading analysis...</p> : null}
      {errorMessage ? <p>{errorMessage}</p> : null}

      {!isLoading && analysisData ? (
        <div className="analysis-layout">
          <div className="analysis-metrics-grid">
            <MetricCard title="Total problems solved" value={analysisData.totalProblemsSolved} />
            <MetricCard
              title="Total revisions"
              value={analysisData.totalRevisions}
              subtitle="Based on available tracked confidence history"
            />
          </div>

          <div className="analysis-two-col-grid">
            <PieChartCard
              title="Problems by difficulty"
              data={analysisData.problemsByDifficulty}
              dataKey="count"
              emptyMessage="No solved problems yet."
            />

            <LineChartCard
              title="Revisions over time"
              data={analysisData.revisionsOverTime}
              dataKey="revisions"
              emptyMessage="No scheduled revision timeline yet."
            />

            <BarChartCard
              title="Weak patterns (avg confidence < 3)"
              data={analysisData.weakPatterns}
              dataKey="averageConfidence"
              emptyMessage="No weak patterns currently."
            />

            <SimpleRankList
              title="Strong patterns (avg confidence ≥ 4)"
              items={analysisData.strongPatterns}
              emptyMessage="No strong patterns identified yet."
              formatter={(item) => `${item.averageConfidence} avg (${item.samples})`}
            />

            <BarChartCard
              title="Pattern-wise confidence distribution"
              data={analysisData.patternDistribution}
              dataKey="averageConfidence"
              emptyMessage="Not enough pattern confidence data."
            />

            <BarChartCard
              title="Data structure strength"
              data={analysisData.dataStructureStrength}
              dataKey="averageConfidence"
              emptyMessage="Not enough data structure confidence data."
            />

            <SimpleRankList
              title="Weakest data structures"
              items={analysisData.weakestDataStructures}
              emptyMessage="No weak data structures yet."
              formatter={(item) => `${item.averageConfidence} avg (${item.samples})`}
            />

            <LineChartCard
              title="Confidence trend over time"
              data={analysisData.confidenceTrend}
              dataKey="confidence"
              emptyMessage="No confidence trend points yet."
              statusMessage={analysisData.trendStatus.message}
              statusTone={analysisData.trendStatus.status}
            />
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default AnalysisPage
