const MULTIPLIER = 2

const knockoutStages = new Set([
  'LAST_32', 'LAST_16', 'QUARTER_FINALS', 'SEMI_FINALS', 'THIRD_PLACE', 'FINAL'
])

function isKnockout(stage?: string): boolean {
  return stage ? knockoutStages.has(stage) : false
}

export function calculateScore(
  prediction: { homeGoals: number; awayGoals: number },
  result: { homeGoals: number; awayGoals: number },
  stage?: string
): number {
  const multiplier = isKnockout(stage) ? MULTIPLIER : 1

  const exact =
    prediction.homeGoals === result.homeGoals &&
    prediction.awayGoals === result.awayGoals

  if (exact) return 3 * multiplier

  const predSign = Math.sign(prediction.homeGoals - prediction.awayGoals)
  const resultSign = Math.sign(result.homeGoals - result.awayGoals)

  if (predSign === resultSign) return 1 * multiplier

  return 0
}
