import { db, Timestamp } from './firebase-admin'
import type { DocumentSnapshot } from 'firebase-admin/firestore'
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

  const predsSnap = await withRetry(() =>
    db
      .collection('predictions')
      .where('gameId', '==', gameId)
      .get()
  )

  if (predsSnap.empty) {
    console.log(`  No predictions for game ${gameId}.`)
    return
  }

  const batch = db.batch()
  const userDeltas = new Map<string, number>()
  let predictionCount = 0

  for (const doc of predsSnap.docs) {
    const pred = doc.data()
    const oldPoints = pred.points ?? 0
    const newPoints = calculateScore(
      { homeGoals: pred.homeGoals, awayGoals: pred.awayGoals },
      result
    )
    if (newPoints === oldPoints) continue
    batch.update(doc.ref, { points: newPoints })
    predictionCount++
    const prev = userDeltas.get(pred.userId) ?? 0
    userDeltas.set(pred.userId, prev + (newPoints - oldPoints))
  }

  if (predictionCount === 0) {
    console.log(`  No prediction points changed for game ${gameId}.`)
    return
  }

  const affectedUsers = [...userDeltas.entries()].filter(([, v]) => v !== 0)
  if (affectedUsers.length > 0) {
    const userRefs = affectedUsers.map(([uid]) => db.collection('users').doc(uid))
    const userDocs: DocumentSnapshot[] = []
    for (let i = 0; i < userRefs.length; i += CHUNK_SIZE) {
      const chunk = userRefs.slice(i, i + CHUNK_SIZE)
      const snaps = await withRetry(() => db.getAll(...chunk))
      userDocs.push(...snaps)
    }
    for (const userDoc of userDocs) {
      if (!userDoc.exists) continue
      const userId = userDoc.id
      const delta = userDeltas.get(userId)!
      const current = (userDoc.data()?.predictionPoints as number) ?? 0
      batch.update(userDoc.ref, { predictionPoints: current + delta })
      console.log(`  User ${userId}: predictionPoints ${current} → ${current + delta} (Δ ${delta}).`)
    }
  }

  await batch.commit()
  console.log(`  Points updated for ${predictionCount} predictions in game ${gameId}.`)
}

const CHUNK_SIZE = 10

async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 4,
): Promise<T> {
  let lastError: Error
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (err: any) {
      lastError = err
      if (err?.code === 8) {
        const delay = Math.pow(2, attempt) * 1000
        console.log(`  Quota exceeded — tentativa ${attempt + 1}/${maxRetries} em ${delay}ms...`)
        await new Promise(r => setTimeout(r, delay))
      } else {
        throw err
      }
    }
  }
  throw lastError!
}

// ─── Sync ────────────────────────────────────────────────────────
async function syncGames() {
  console.log('[sync] Fetching all World Cup matches...')

  const data = await getWorldCupMatches()

  if (!data?.matches?.length) {
    console.log('[sync] No matches returned.')
    return
  }

  const refs = data.matches.map(m => db.collection('games').doc(String(m.id)))
  const snapshots: DocumentSnapshot[] = []
  for (let i = 0; i < refs.length; i += CHUNK_SIZE) {
    const chunk = refs.slice(i, i + CHUNK_SIZE)
    const snaps = await withRetry(() => db.getAll(...chunk))
    snapshots.push(...snaps)
  }
  const prevMap = new Map(snapshots.map(s => [s.id, s]))

  const batch = db.batch()
  const newlyFinished: string[] = []
  let changedCount = 0

  for (const m of data.matches) {
    const id = String(m.id)
    const status = mapStatus(m.status)
    const homeGoals = m.score.fullTime.home
    const awayGoals = m.score.fullTime.away
    const prev = prevMap.get(id)

    const scoreAvailable = homeGoals !== null && awayGoals !== null

    if (
      prev?.exists &&
      prev.data()?.status === status &&
      prev.data()?.homeGoals === homeGoals &&
      prev.data()?.awayGoals === awayGoals
    ) {
      continue
    }

    const update: Record<string, unknown> = { status }
    if (scoreAvailable) {
      update.homeGoals = homeGoals
      update.awayGoals = awayGoals
    }

    batch.set(db.collection('games').doc(id), update, { merge: true })
    changedCount++

    if (
      status === 'FT' && (
        prev?.data()?.status !== 'FT' ||
        prev.data()?.homeGoals !== homeGoals ||
        prev.data()?.awayGoals !== awayGoals
      )
    ) {
      newlyFinished.push(id)
    }
  }

  if (changedCount > 0) {
    await batch.commit()
    console.log(`[sync] Updated ${changedCount}/${data.matches.length} games in Firestore.`)
  } else {
    console.log(`[sync] No changes detected among ${data.matches.length} games.`)
  }

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
  console.log('[recover] Recalculating all prediction points from game results...')

  const gamesSnap = await db.collection('games')
    .where('status', '==', 'FT')
    .get()
  const gameResults = new Map<string, { homeGoals: number; awayGoals: number }>()
  for (const doc of gamesSnap.docs) {
    const g = doc.data()
    if (g.homeGoals != null && g.awayGoals != null) {
      gameResults.set(doc.id, { homeGoals: g.homeGoals, awayGoals: g.awayGoals })
    }
  }
  console.log(`[recover] Found ${gameResults.size} finished games with scores.`)

  const predsSnap = await db.collection('predictions').get()
  const userTotals = new Map<string, number>()
  let updatedCount = 0

  const batch = db.batch()
  for (const doc of predsSnap.docs) {
    const pred = doc.data()
    const result = gameResults.get(pred.gameId)
    if (!result) continue

    const newPoints = calculateScore(
      { homeGoals: pred.homeGoals, awayGoals: pred.awayGoals },
      result
    )
    if (pred.points !== newPoints) {
      batch.update(doc.ref, { points: newPoints })
      updatedCount++
    }

    const prev = userTotals.get(pred.userId) ?? 0
    userTotals.set(pred.userId, prev + newPoints)
  }

  for (const [userId, total] of userTotals) {
    batch.update(db.collection('users').doc(userId), { predictionPoints: total })
  }

  await batch.commit()

  console.log(`[recover] Recalculated ${updatedCount} predictions and updated ${userTotals.size} users.`)
  for (const [userId, total] of userTotals) {
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
      console.log('  recover - Recalculate all prediction points from game results')
      process.exit(1)
  }
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
