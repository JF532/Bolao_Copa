import dotenv from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { readFileSync, existsSync } from 'fs'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '..', '.env') })

function loadCredentials(): Record<string, string> {
  const fromEnv = process.env.FIREBASE_SERVICE_ACCOUNT
  if (fromEnv) {
    try { return JSON.parse(fromEnv) } catch { /* not JSON */ }
  }

  const paths = [
    process.env.GOOGLE_APPLICATION_CREDENTIALS,
    resolve(__dirname, '..', 'service-account.json'),
  ]

  for (const p of paths) {
    if (p && existsSync(p)) {
      const content = readFileSync(p, 'utf-8')
      try { return JSON.parse(content) } catch { /* skip */ }
    }
  }

  throw new Error(
    'Credenciais do Firebase Admin não encontradas.\n' +
    'Crie um arquivo service-account.json na raiz do projeto\n' +
    '(baixado do Firebase Console > Contas de serviço).'
  )
}

const serviceAccount = loadCredentials()

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) })
}

const db = getFirestore()

export { db, Timestamp }
export default db
