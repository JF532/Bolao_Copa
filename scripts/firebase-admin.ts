import dotenv from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { readFileSync, existsSync } from 'fs'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '..', '.env') })

function loadCredentials(): Record<string, string> {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT
  if (raw) {
    try { return JSON.parse(raw) } catch {
      throw new Error(
        'FIREBASE_SERVICE_ACCOUNT contém um JSON inválido.\n' +
        'Verifique o conteúdo da variável ou secret.'
      )
    }
  }

  const filePath = resolve(__dirname, '..', 'service-account.json')
  if (existsSync(filePath)) {
    const content = readFileSync(filePath, 'utf-8')
    try { return JSON.parse(content) } catch { /* skip */ }
  }

  throw new Error(
    'Credenciais do Firebase Admin não encontradas.\n' +
    'No GitHub Actions: configure o secret FIREBASE_SERVICE_ACCOUNT.\n' +
    'Localmente: crie service-account.json na raiz ou adicione\n' +
    'FIREBASE_SERVICE_ACCOUNT no .env com o JSON da service account.'
  )
}

const serviceAccount = loadCredentials()

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) })
}

const db = getFirestore()

export { db, Timestamp }
export default db
