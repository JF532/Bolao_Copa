import { db, Timestamp } from './firebase-admin'
import { calculateScore } from '../src/utils/calculateScore'
import {
  getWorldCupMatches,
  mapStatus,
} from './football-data'

async function calculatePointsForGame(gameId: string) {
  const gameDoc = await db.collection('games').doc(gameId).get()
  if (!gameDoc.exists) return

  const game = gameDoc.data()!
  const homeGoals = game.homeGoals as number | null
  const awayGoals = game.awayGoals as number | null
  if (homeGoals === null || awayGoals === null) return

  const result = { homeGoals, awayGoals }

  const predsSnap = await db
    .collection('predictions')
    .where('gameId', '==', gameId)
    .get()

  if (predsSnap.empty) {
    console.log(`  No predictions for game ${gameId}.`)
    return
  }

  const batch = db.batch()
  const userDeltas = new Map<string, number>()

  for (const doc of predsSnap.docs) {
    const pred = doc.data()
    if (pred.points !== null && pred.points !== undefined) {
      continue
    }
    const points = calculateScore(
      { homeGoals: pred.homeGoals, awayGoals: pred.awayGoals },
      result
    )
    batch.update(doc.ref, { points })
    const prev = userDeltas.get(pred.userId) ?? 0
    userDeltas.set(pred.userId, prev + points)
  }

  const updatedCount = [...userDeltas.values()].reduce((s, v) => s + (v !== 0 ? 1 : 0), 0)
  if (updatedCount === 0) {
    console.log(`  All predictions for game ${gameId} already have points.`)
    return
  }

  await batch.commit()
  console.log(
    `  Points updated for ${updatedCount} predictions in game ${gameId}.`
  )

  for (const [userId, delta] of userDeltas) {
    if (delta === 0) continue
    const userDoc = await db.collection('users').doc(userId).get()
    const current = (userDoc.data()?.predictionPoints as number) ?? 0
    await db.collection('users').doc(userId).update({ predictionPoints: current + delta })
    console.log(`  User ${userId}: predictionPoints ${current} → ${current + delta} (Δ ${delta}).`)
  }
}

function toTimestamp(val: unknown): Timestamp | null {
  if (!val) return null
  if (val instanceof Timestamp) return val
  if (typeof val === 'number') return new Timestamp(Math.floor(val / 1000), 0)
  return null
}

// ─── Sync (a cada 5 min) ─────────────────────────────────────────
async function syncGames() {
  console.log('[sync] Fetching all World Cup matches...')

  const data = await getWorldCupMatches()

  if (!data?.matches?.length) {
    console.log('[sync] No matches returned.')
    return
  }

  const batch = db.batch()
  const newlyFinished: string[] = []

  for (const m of data.matches) {
    const id = String(m.id)
    const status = mapStatus(m.status)
    const update: Record<string, unknown> = { status }

    if (m.score.fullTime.home !== null && m.score.fullTime.away !== null) {
      update.homeGoals = m.score.fullTime.home
      update.awayGoals = m.score.fullTime.away
    }

    batch.set(db.collection('games').doc(id), update, { merge: true })

    if (status === 'FT') {
      newlyFinished.push(id)
    }
  }

  await batch.commit()
  console.log(`[sync] Updated ${data.matches.length} games in Firestore.`)

  for (const gameId of newlyFinished) {
    await calculatePointsForGame(gameId)
  }

  console.log('[sync] Done.')
}

// ─── Import (one-time) ─────────────────────────────────────────
async function importInitialGames() {
  console.log('[import] Fetching all World Cup matches...')

  const data = await getWorldCupMatches()

  if (!data?.matches?.length) {
    console.log('[import] No matches returned.')
    return
  }

  const batch = db.batch()

  for (const m of data.matches) {
    const id = String(m.id)
    const kickoffDate = new Date(m.utcDate)

    batch.set(db.collection('games').doc(id), {
      id,
      homeTeam: m.homeTeam.name,
      awayTeam: m.awayTeam.name,
      kickoff: Timestamp.fromDate(kickoffDate),
      status: mapStatus(m.status),
      homeGoals: m.score.fullTime.home,
      awayGoals: m.score.fullTime.away,
    })
  }

  await batch.commit()
  console.log(`[import] ${data.matches.length} games saved to Firestore.`)
}

// ─── Recover ──────────────────────────────────────────────────
async function recoverPredictionPoints() {
  console.log('[recover] Summing all prediction points per user...')

  const predsSnap = await db.collection('predictions').get()
  const totals = new Map<string, number>()

  for (const doc of predsSnap.docs) {
    const pred = doc.data()
    const pts = (pred.points as number) ?? 0
    const prev = totals.get(pred.userId) ?? 0
    totals.set(pred.userId, prev + pts)
  }

  const batch = db.batch()
  for (const [userId, total] of totals) {
    batch.update(db.collection('users').doc(userId), { predictionPoints: total })
  }
  await batch.commit()

  console.log(`[recover] Updated ${totals.size} users with predictionPoints.`)
  for (const [userId, total] of totals) {
    console.log(`  ${userId}: ${total} pts`)
  }
}

// ─── CLI ───────────────────────────────────────────────────────
const command = process.argv[2]

async function main() {
  switch (command) {
    case 'import':
      await importInitialGames()
      break
    case 'sync':
      await syncGames()
      break
    case 'recover':
      await recoverPredictionPoints()
      break
    default:
      console.log('Usage: npx tsx scripts/sync.ts [import|sync|recover]')
      console.log('  import  - Fetch ALL World Cup games (one-time)')
      console.log('  sync    - Update games and calculate points')
      console.log('  recover - Rebuild predictionPoints from all predictions')
      process.exit(1)
  }
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
