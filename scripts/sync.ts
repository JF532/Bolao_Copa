import { db, Timestamp } from './firebase-admin'
import { calculateScore } from '../src/utils/calculateScore'
import {
  getWorldCupMatches,
  getFinishedWorldCupMatches,
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
  for (const doc of predsSnap.docs) {
    const pred = doc.data()
    const points = calculateScore(
      { homeGoals: pred.homeGoals, awayGoals: pred.awayGoals },
      result
    )
    batch.update(doc.ref, { points })
  }
  await batch.commit()
  console.log(
    `  Points updated for ${predsSnap.size} predictions in game ${gameId}.`
  )
}

function toTimestamp(val: unknown): Timestamp | null {
  if (!val) return null
  if (val instanceof Timestamp) return val
  if (typeof val === 'number') return new Timestamp(Math.floor(val / 1000), 0)
  return null
}

// ─── Sync (daily) ───────────────────────────────────────────────
async function syncGames() {
  console.log('[sync] Fetching finished World Cup matches...')

  const data = await getFinishedWorldCupMatches()

  if (!data?.matches?.length) {
    console.log('[sync] No finished matches returned.')
    return
  }

  const batch = db.batch()
  const newlyFinished: string[] = []

  for (const m of data.matches) {
    const id = String(m.id)
    const status = mapStatus(m.status)

    batch.set(db.collection('games').doc(id), {
      status,
      homeGoals: m.score.fullTime.home,
      awayGoals: m.score.fullTime.away,
    }, { merge: true })

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
    default:
      console.log('Usage: npx tsx scripts/sync.ts [import|sync]')
      console.log('  import  - Fetch ALL World Cup games (one-time)')
      console.log('  sync    - Update only non-finished games')
      process.exit(1)
  }
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
