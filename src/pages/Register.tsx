import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { SoccerIcon } from '../components/ui/SoccerIcon'
import { motion } from 'framer-motion'
import { UserPlus } from 'lucide-react'
import { isValidEmail, isValidPassword, isValidName } from '../utils/validators'

export function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!isValidName(name)) { setError('Nome deve ter pelo menos 2 caracteres'); return }
    if (!isValidEmail(email)) { setError('Email inválido'); return }
    if (!isValidPassword(password)) { setError('Senha deve ter no mínimo 6 caracteres'); return }
    if (password !== confirmPassword) { setError('Senhas não conferem'); return }

    setLoading(true)
    try {
      await register(email, password, name)
      navigate('/', { replace: true })
    } catch (err: any) {
      const msg =
        err?.code === 'auth/email-already-in-use' ? 'Este email já está cadastrado.' :
        err?.code === 'auth/weak-password' ? 'Senha muito fraca.' :
        err?.code === 'auth/invalid-email' ? 'Email inválido.' :
        'Erro ao criar conta. Tente novamente.'
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
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Crie sua conta</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nome"
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={error}
              disabled={loading}
            />
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            <Input
              label="Confirmar senha"
              type="password"
              placeholder="••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
            <Button type="submit" loading={loading} className="w-full">
              <UserPlus size={16} />
              Cadastrar
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Já tem conta?{' '}
          <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            Entre
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
