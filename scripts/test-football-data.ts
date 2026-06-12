import './firebase-admin'
import { getCompetition, getWorldCupMatches } from './football-data'

async function main() {
  // 1. Validar token e obter informações da competição
  console.log('--- GET /competitions/WC ---')
  const comp = await getCompetition() as Record<string, unknown>
  console.log(`Nome: ${comp.name ?? 'N/A'}`)
  console.log(`Temporada: ${(comp as any)?.currentSeason?.startDate ?? 'N/A'} → ${(comp as any)?.currentSeason?.endDate ?? 'N/A'}`)
  console.log(`Tipo: ${comp.type ?? 'N/A'}`)
  console.log(`Plan disponível: ${comp.plan ?? 'N/A'}`)
  console.log()

  // 2. Buscar todos os jogos
  console.log('--- GET /competitions/WC/matches ---')
  const data = await getWorldCupMatches()

  if (!data?.matches?.length) {
    console.log('Nenhum jogo encontrado para a Copa do Mundo.')
    return
  }

  console.log(`Total de jogos: ${data.matches.length}`)
  console.log()

  // 3. Exibir os primeiros 5 jogos
  console.log('Primeiros 5 jogos:')
  for (const m of data.matches.slice(0, 5)) {
    const date = new Date(m.utcDate).toLocaleString('pt-BR')
    const home = m.homeTeam.name
    const away = m.awayTeam.name
    const status = m.status
    const score = `${m.score.fullTime.home ?? '?'} × ${m.score.fullTime.away ?? '?'}`
    console.log(`  ${date} | ${home} × ${away} | ${status} | ${score}`)
  }
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
