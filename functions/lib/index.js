import { onSchedule } from 'firebase-functions/v2/scheduler';
import { defineSecret } from 'firebase-functions/params';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
const footballToken = defineSecret('FOOTBALL_DATA_TOKEN');
const API_BASE = 'https://api.football-data.org/v4';
function mapStatus(status) {
    switch (status) {
        case 'IN_PLAY':
        case 'PAUSED':
            return 'LIVE';
        case 'FINISHED':
            return 'FT';
        default:
            return 'NS';
    }
}
function calculateScore(prediction, result) {
    const exact = prediction.homeGoals === result.homeGoals &&
        prediction.awayGoals === result.awayGoals;
    if (exact)
        return 3;
    const predSign = Math.sign(prediction.homeGoals - prediction.awayGoals);
    const resultSign = Math.sign(result.homeGoals - result.awayGoals);
    if (predSign === resultSign)
        return 1;
    return 0;
}
async function fetchFromAPI(endpoint, token) {
    const res = await fetch(`${API_BASE}/${endpoint}`, {
        headers: { 'X-Auth-Token': token },
    });
    if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`Football-Data API error: ${res.status} — ${body}`);
    }
    return res.json();
}
async function calculatePointsForGame(db, gameId) {
    const gameDoc = await db.collection('games').doc(gameId).get();
    if (!gameDoc.exists)
        return;
    const game = gameDoc.data();
    const homeGoals = game.homeGoals;
    const awayGoals = game.awayGoals;
    if (homeGoals === null || awayGoals === null)
        return;
    const result = { homeGoals, awayGoals };
    const predsSnap = await db
        .collection('predictions')
        .where('gameId', '==', gameId)
        .get();
    if (predsSnap.empty) {
        console.log(`  No predictions for game ${gameId}.`);
        return;
    }
    const batch = db.batch();
    for (const doc of predsSnap.docs) {
        const pred = doc.data();
        const points = calculateScore({ homeGoals: pred.homeGoals, awayGoals: pred.awayGoals }, result);
        batch.update(doc.ref, { points });
    }
    await batch.commit();
    console.log(`  Points updated for ${predsSnap.size} predictions in game ${gameId}.`);
}
async function syncGames(token) {
    if (!getApps().length) {
        initializeApp();
    }
    const db = getFirestore();
    console.log('[sync] Fetching World Cup matches...');
    const data = await fetchFromAPI('competitions/WC/matches', token);
    if (!data?.matches?.length) {
        console.log('[sync] No matches returned.');
        return;
    }
    const batch = db.batch();
    const newlyFinished = [];
    for (const m of data.matches) {
        const id = String(m.id);
        const status = mapStatus(m.status);
        batch.set(db.collection('games').doc(id), {
            status,
            homeGoals: m.score.fullTime.home,
            awayGoals: m.score.fullTime.away,
        }, { merge: true });
        if (status === 'FT') {
            newlyFinished.push(id);
        }
    }
    await batch.commit();
    console.log(`[sync] Updated ${data.matches.length} games in Firestore.`);
    for (const gameId of newlyFinished) {
        await calculatePointsForGame(db, gameId);
    }
    console.log('[sync] Done.');
}
export const syncWorldCup = onSchedule({
    schedule: 'every 5 minutes',
    secrets: [footballToken],
    timeZone: 'America/Sao_Paulo',
}, async (_event) => {
    const token = footballToken.value();
    await syncGames(token);
});
