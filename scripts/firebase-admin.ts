import dotenv from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '..', '.env') })

function loadCredentials(): Record<string, string> {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT

  if (!raw) {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT não encontrada.\n' +
      'No GitHub Actions, configure o secret com o JSON da service account.\n' +
      'Localmente, crie um arquivo .env com:\n' +
      '  FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}'
    )
  }

  try {
    return JSON.parse(raw)
  } catch {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT contém um JSON inválido.\n' +
      'Verifique se o conteúdo colado é um JSON válido da service account.'
    )
  }
}

const serviceAccount = loadCredentials()

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) })
}

const db = getFirestore()

export { db, Timestamp }
export default db
