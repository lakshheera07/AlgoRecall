export function deriveRecallCategory(confidence) {
  if (confidence <= 2) {
    return 'Spend More Time'
  }

  if (confidence === 3) {
    return 'Needs Revision'
  }

  return 'Excellent'
}

export function computeNextRevisionAt(confidence, now = new Date()) {
  const nextDate = new Date(now)

  if (confidence <= 2) {
    nextDate.setDate(nextDate.getDate() + 1)
    return nextDate
  }

  if (confidence === 3) {
    nextDate.setDate(nextDate.getDate() + 3)
    return nextDate
  }

  nextDate.setDate(nextDate.getDate() + 7)
  return nextDate
}

export function isValidConfidence(confidence) {
  return Number.isInteger(confidence) && confidence >= 1 && confidence <= 5
}
