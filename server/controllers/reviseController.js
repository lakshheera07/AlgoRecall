import prisma from '../db.js'

const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

function toDateLabel(value) {
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

function average(total, count) {
  if (count === 0) {
    return 0
  }

  return Number((total / count).toFixed(2))
}

function latestConfidenceOf(problem) {
  return problem.recallLogs[0]?.confidence ?? null
}

function toProblemWithLatestConfidence(problem) {
  const latestConfidence = latestConfidenceOf(problem)
  return {
    ...problem,
    latestConfidence,
    recallLogs: undefined,
  }
}

function sortByWeakestFirst(left, right) {
  const leftConfidence = left.latestConfidence ?? Number.POSITIVE_INFINITY
  const rightConfidence = right.latestConfidence ?? Number.POSITIVE_INFINITY
  return leftConfidence - rightConfidence
}

function buildGroupedConfidenceOverview(items, selector) {
  const grouped = new Map()

  for (const item of items) {
    const key = selector(item) || 'Unknown'
    const current = grouped.get(key) ?? { total: 0, samples: 0 }

    if (typeof item.latestConfidence === 'number') {
      grouped.set(key, {
        total: current.total + item.latestConfidence,
        samples: current.samples + 1,
      })
    } else {
      grouped.set(key, current)
    }
  }

  return [...grouped.entries()]
    .map(([name, value]) => ({
      name,
      samples: value.samples,
      averageConfidence:
        value.samples > 0 ? Number((value.total / value.samples).toFixed(2)) : null,
    }))
    .sort((left, right) => left.name.localeCompare(right.name))
}

function buildDifficultyBreakdown(problems) {
  const counts = new Map(DIFFICULTIES.map((difficulty) => [difficulty, 0]))

  for (const problem of problems) {
    const key = problem.difficulty || 'Unknown'
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .filter((item) => item.count > 0)
}

function buildPatternDistributionFromLogs(logs) {
  const patternMap = new Map()

  for (const log of logs) {
    const pattern = log.problem?.pattern ?? 'Unknown'
    const existing = patternMap.get(pattern) ?? { total: 0, count: 0 }

    patternMap.set(pattern, {
      total: existing.total + log.confidence,
      count: existing.count + 1,
    })
  }

  return [...patternMap.entries()]
    .map(([name, value]) => ({
      name,
      averageConfidence: Number((value.total / value.count).toFixed(2)),
      samples: value.count,
    }))
    .sort((left, right) => left.averageConfidence - right.averageConfidence)
}

function buildRevisionsOverTime(logs) {
  const grouped = new Map()

  for (const log of logs) {
    const dateKey = new Date(log.createdAt).toISOString().slice(0, 10)
    const current = grouped.get(dateKey) ?? 0
    grouped.set(dateKey, current + 1)
  }

  return [...grouped.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([dateKey, count]) => ({
      label: toDateLabel(dateKey),
      revisions: count,
    }))
}

function buildConfidenceTrend(logs) {
  const grouped = new Map()

  for (const log of logs) {
    const dateKey = new Date(log.createdAt).toISOString().slice(0, 10)
    const current = grouped.get(dateKey) ?? { total: 0, count: 0 }

    grouped.set(dateKey, {
      total: current.total + log.confidence,
      count: current.count + 1,
    })
  }

  return [...grouped.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([dateKey, stats]) => ({
      label: toDateLabel(dateKey),
      confidence: average(stats.total, stats.count),
    }))
}

function computeTrendStatus(trendSeries) {
  if (trendSeries.length < 2) {
    return {
      status: 'stable',
      message: 'Need more revision points to detect trend.',
    }
  }

  const first = trendSeries[0].confidence
  const last = trendSeries[trendSeries.length - 1].confidence
  const delta = Number((last - first).toFixed(2))

  if (delta >= 0.25) {
    return {
      status: 'improving',
      message: `Confidence is improving (+${delta}).`,
    }
  }

  if (delta <= -0.25) {
    return {
      status: 'declining',
      message: `Confidence is declining (${delta}).`,
    }
  }

  return {
    status: 'stable',
    message: 'Confidence is stable.',
  }
}

export async function getRevisionTodayHandler(_request, response) {
  const now = new Date()

  try {
    const dueProblems = await prisma.problem.findMany({
      where: {
        nextRevisionAt: {
          lte: now,
        },
      },
      include: {
        recallLogs: {
          select: {
            confidence: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    })

    const enrichedProblems = dueProblems
      .map(toProblemWithLatestConfidence)
      .sort(sortByWeakestFirst)

    return response.status(200).json(enrichedProblems)
  } catch (error) {
    console.error(error)
    return response.status(500).json({ error: 'Failed to fetch revision list' })
  }
}

export async function getUpcomingRevisionsHandler(_request, response) {
  const now = new Date()

  try {
    const upcoming = await prisma.problem.findMany({
      where: {
        nextRevisionAt: {
          gt: now,
        },
      },
      orderBy: {
        nextRevisionAt: 'asc',
      },
      include: {
        recallLogs: {
          select: {
            confidence: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    })

    return response.status(200).json(upcoming.map(toProblemWithLatestConfidence))
  } catch (error) {
    console.error(error)
    return response.status(500).json({ error: 'Failed to fetch upcoming revisions' })
  }
}

export async function getRevisionOverviewHandler(_request, response) {
  try {
    const problems = await prisma.problem.findMany({
      include: {
        recallLogs: {
          select: {
            confidence: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    })

    const withConfidence = problems.map(toProblemWithLatestConfidence)

    return response.status(200).json({
      byDifficulty: buildGroupedConfidenceOverview(withConfidence, (problem) => problem.difficulty),
      byDataStructure: buildGroupedConfidenceOverview(
        withConfidence,
        (problem) => problem.dataStructure,
      ),
    })
  } catch (error) {
    console.error(error)
    return response.status(500).json({ error: 'Failed to fetch revision overview' })
  }
}

export async function getPatternAnalyticsHandler(_request, response) {
  try {
    const logs = await prisma.recallLog.findMany({
      select: {
        confidence: true,
        problemId: true,
        createdAt: true,
        problem: {
          select: {
            pattern: true,
          },
        },
      },
    })

    const patternMap = new Map()

    for (const log of logs) {
      const pattern = log.problem?.pattern ?? 'Unknown'
      const existing = patternMap.get(pattern) ?? { total: 0, count: 0 }

      patternMap.set(pattern, {
        total: existing.total + log.confidence,
        count: existing.count + 1,
      })
    }

    const summaries = [...patternMap.entries()].map(([pattern, value]) => ({
      pattern,
      averageConfidence: Number((value.total / value.count).toFixed(2)),
      samples: value.count,
    }))

    const weakPatterns = summaries.filter((item) => item.averageConfidence < 3)
    const strongPatterns = summaries.filter((item) => item.averageConfidence >= 4)

    return response.status(200).json({
      weakPatterns,
      strongPatterns,
    })
  } catch (error) {
    console.error(error)
    return response.status(500).json({ error: 'Failed to fetch pattern analytics' })
  }
}

export async function getRevisionHubHandler(_request, response) {
  const now = new Date()

  try {
    const [dueProblems, upcomingProblems, logs, overviewProblems] = await Promise.all([
      prisma.problem.findMany({
        where: {
          nextRevisionAt: {
            lte: now,
          },
        },
        include: {
          recallLogs: {
            select: {
              confidence: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
          },
        },
      }),
      prisma.problem.findMany({
        where: {
          nextRevisionAt: {
            gt: now,
          },
        },
        orderBy: {
          nextRevisionAt: 'asc',
        },
        include: {
          recallLogs: {
            select: {
              confidence: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
          },
        },
      }),
      prisma.recallLog.findMany({
        select: {
          confidence: true,
          problem: {
            select: {
              pattern: true,
            },
          },
        },
      }),
      prisma.problem.findMany({
        include: {
          recallLogs: {
            select: {
              confidence: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
          },
        },
      }),
    ])

    const due = dueProblems.map(toProblemWithLatestConfidence).sort(sortByWeakestFirst)
    const upcoming = upcomingProblems.map(toProblemWithLatestConfidence)

    const patternMap = new Map()
    for (const log of logs) {
      const pattern = log.problem?.pattern ?? 'Unknown'
      const current = patternMap.get(pattern) ?? { total: 0, count: 0 }

      patternMap.set(pattern, {
        total: current.total + log.confidence,
        count: current.count + 1,
      })
    }

    const patternSummaries = [...patternMap.entries()].map(([pattern, value]) => ({
      pattern,
      averageConfidence: Number((value.total / value.count).toFixed(2)),
      samples: value.count,
    }))

    const overviewWithConfidence = overviewProblems.map(toProblemWithLatestConfidence)

    return response.status(200).json({
      today: due,
      upcoming,
      pattern: {
        weakPatterns: patternSummaries.filter((item) => item.averageConfidence < 3),
        strongPatterns: patternSummaries.filter((item) => item.averageConfidence >= 4),
      },
      overview: {
        byDifficulty: buildGroupedConfidenceOverview(
          overviewWithConfidence,
          (problem) => problem.difficulty,
        ),
        byDataStructure: buildGroupedConfidenceOverview(
          overviewWithConfidence,
          (problem) => problem.dataStructure,
        ),
      },
    })
  } catch (error) {
    console.error(error)
    return response.status(500).json({ error: 'Failed to fetch revision hub data' })
  }
}

export async function getRevisionSessionQueueHandler(request, response) {
  return getRevisionTodayHandler(request, response)
}

export async function getAnalysisInsightsHandler(_request, response) {
  try {
    const [problems, logs] = await Promise.all([
      prisma.problem.findMany({
        include: {
          recallLogs: {
            select: {
              confidence: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
          },
        },
      }),
      prisma.recallLog.findMany({
        select: {
          confidence: true,
          createdAt: true,
          problem: {
            select: {
              pattern: true,
            },
          },
        },
      }),
    ])

    const withLatestConfidence = problems.map(toProblemWithLatestConfidence)
    const dataStructureStrength = buildGroupedConfidenceOverview(
      withLatestConfidence,
      (problem) => problem.dataStructure,
    )

    const patternDistribution = buildPatternDistributionFromLogs(logs)
    const strongPatterns = patternDistribution
      .filter((item) => item.averageConfidence >= 4)
      .sort((left, right) => right.averageConfidence - left.averageConfidence)
    const weakPatterns = patternDistribution
      .filter((item) => item.averageConfidence < 3)
      .sort((left, right) => right.samples - left.samples)

    const revisionsOverTime = buildRevisionsOverTime(logs)
    const confidenceTrend = buildConfidenceTrend(logs)

    return response.status(200).json({
      totalProblemsSolved: withLatestConfidence.length,
      totalRevisions: logs.length,
      problemsByDifficulty: buildDifficultyBreakdown(withLatestConfidence),
      weakPatterns,
      strongPatterns,
      patternDistribution,
      dataStructureStrength,
      weakestDataStructures: dataStructureStrength.slice(0, 4),
      revisionsOverTime,
      confidenceTrend,
      trendStatus: computeTrendStatus(confidenceTrend),
    })
  } catch (error) {
    console.error(error)
    return response.status(500).json({ error: 'Failed to fetch analysis insights' })
  }
}
