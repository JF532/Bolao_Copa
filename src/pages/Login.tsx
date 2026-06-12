import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { SoccerIcon } from '../components/ui/SoccerIcon'
import { motion } from 'framer-motion'
import { LogIn } from 'lucide-react'
import { isValidEmail, isValidPassword } from '../utils/validators'

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!isValidEmail(email)) { setError('Email inválido'); return }
    if (!isValidPassword(password)) { setError('Senha deve ter no mínimo 6 caracteres'); return }

    setLoading(true)
    try {
      await login(email, password)
      navigate('/', { replace: true })
    } catch (err: any) {
      const msg =
        err?.code === 'auth/invalid-credential' ? 'Email ou senha incorretos.' :
        err?.code === 'auth/user-not-found' ? 'Usuário não encontrado.' :
        err?.code === 'auth/wrong-password' ? 'Senha incorreta.' :
        err?.code === 'auth/too-many-requests' ? 'Muitas tentativas. Tente mais tarde.' :
        'Erro ao fazer login. Tente novamente.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas dark:bg-canvas-dark px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <span className="text-4xl"><SoccerIcon size="lg" /></span>
          <h1 className="text-2xl font-bold mt-2">Bolão Copa 2026</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Entre na sua conta</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
              disabled={loading}
            />
            <Input
              label="Senha"
              type="password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <Button type="submit" loading={loading} className="w-full">
              <LogIn size={16} />
              Entrar
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Não tem conta?{' '}
          <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            Cadastre-se
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
