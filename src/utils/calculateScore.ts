export function calculateScore(
  prediction: { homeGoals: number; awayGoals: number },
  result: { homeGoals: number; awayGoals: number }
): number {
  const exact =
    prediction.homeGoals === result.homeGoals &&
    prediction.awayGoals === result.awayGoals

  if (exact) return 3

  const predSign = Math.sign(prediction.homeGoals - prediction.awayGoals)
  const resultSign = Math.sign(result.homeGoals - result.awayGoals)

  if (predSign === resultSign) return 1

  return 0
}
