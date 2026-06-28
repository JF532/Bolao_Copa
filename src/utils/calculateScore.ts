const MULTIPLIER = 2

const knockoutStages = new Set([
  'LAST_32', 'LAST_16', 'QUARTER_FINALS', 'SEMI_FINALS', 'THIRD_PLACE', 'FINAL'
])

function isKnockout(stage?: string): boolean {
  return stage ? knockoutStages.has(stage) : false
}

export interface GameLike {
  duration?: string
  homeGoals?: number | null
  awayGoals?: number | null
  extraTimeHome?: number | null
  extraTimeAway?: number | null
  penaltiesHome?: number | null
  penaltiesAway?: number | null
}

export function getEffectiveResult(game: GameLike): { homeGoals: number; awayGoals: number } | null {
  const home = game.homeGoals ?? null
  const away = game.awayGoals ?? null
  if (home === null || away === null) return null

  if (game.duration === 'PENALTY_SHOOTOUT') {
    return {
      homeGoals: game.extraTimeHome ?? home,
      awayGoals: game.extraTimeAway ?? away,
    }
  }

  if (game.duration === 'EXTRA_TIME') {
    const etHome = game.extraTimeHome
    const etAway = game.extraTimeAway
    if (etHome !== null && etHome !== undefined && etAway !== null && etAway !== undefined) {
      return { homeGoals: etHome, awayGoals: etAway }
    }
    return { homeGoals: home, awayGoals: away }
  }

  return { homeGoals: home, awayGoals: away }
}

export function getDisplayScore(game: GameLike): { home: number; away: number } | null {
  const eff = getEffectiveResult(game)
  if (!eff) return null
  return { home: eff.homeGoals, away: eff.awayGoals }
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
