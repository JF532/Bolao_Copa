import { db, Timestamp } from './firebase-admin'

interface SeedGame {
  homeTeam: string
  awayTeam: string
  kickoff: Date
  homeGoals: number | null
  awayGoals: number | null
}

const seedGames: SeedGame[] = [
  {
    homeTeam: 'Brasil',
    awayTeam: 'Sérvia',
    kickoff: new Date('2026-06-12T16:00:00-03:00'),
    homeGoals: 2,
    awayGoals: 0,
  },
  {
    homeTeam: 'Argentina',
    awayTeam: 'Nigéria',
    kickoff: new Date('2026-06-13T13:00:00-03:00'),
    homeGoals: null,
    awayGoals: null,
  },
  {
    homeTeam: 'Alemanha',
    awayTeam: 'México',
    kickoff: new Date('2026-06-14T16:00:00-03:00'),
    homeGoals: null,
    awayGoals: null,
  },
  {
    homeTeam: 'França',
    awayTeam: 'Tunísia',
    kickoff: new Date('2026-06-15T10:00:00-03:00'),
    homeGoals: null,
    awayGoals: null,
  },
  {
    homeTeam: 'Portugal',
    awayTeam: 'Gana',
    kickoff: new Date('2026-06-16T13:00:00-03:00'),
    homeGoals: null,
    awayGoals: null,
  },
  {
    homeTeam: 'Espanha',
    awayTeam: 'Costa Rica',
    kickoff: new Date('2026-06-17T16:00:00-03:00'),
    homeGoals: null,
    awayGoals: null,
  },
  {
    homeTeam: 'Inglaterra',
    awayTeam: 'Irã',
    kickoff: new Date('2026-06-18T10:00:00-03:00'),
    homeGoals: null,
    awayGoals: null,
  },
  {
    homeTeam: 'Holanda',
    awayTeam: 'Senegal',
    kickoff: new Date('2026-06-19T13:00:00-03:00'),
    homeGoals: null,
    awayGoals: null,
  },
]

async function seed() {
  const col = db.collection('games')
  for (const game of seedGames) {
    const docRef = col.doc()
    await docRef.set({
      id: docRef.id,
      homeTeam: game.homeTeam,
      awayTeam: game.awayTeam,
      kickoff: Timestamp.fromDate(game.kickoff),
      status: 'NS',
      homeGoals: game.homeGoals,
      awayGoals: game.awayGoals,
    })
  }
  console.log(`Seed: ${seedGames.length} games inserted.`)
}

seed().catch((err) => {
  console.error('Seed error:', err)
  process.exit(1)
})
