import { useAuth } from '../hooks/useAuth'
import { useAdmin } from '../hooks/useAdmin'
import { AdminScoreEditor } from '../components/AdminScoreEditor'
import { Spinner } from '../components/ui/Spinner'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/EmptyState'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'

export function Admin() {
  const { user } = useAuth()
  const { users, loading, updatePoints, toggleActive } = useAdmin()

  if (loading) return <Spinner size="lg" />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin"
        description="Gerenciar participantes e pontuações"
      />

      {users.length === 0 ? (
        <EmptyState title="Nenhum usuário cadastrado" />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/50">
                  <th className="py-3 px-4 text-left font-medium text-gray-400">Participante</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-400 hidden sm:table-cell">Email</th>
                  <th className="py-3 px-4 text-center font-medium text-gray-400">Status</th>
                  <th className="py-3 px-4 text-right font-medium text-gray-400">Pontos</th>
                  <th className="py-3 px-4 text-right font-medium text-gray-400">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter((u) => u.id !== user?.uid)
                  .map((u) => {
                    const isActive = u.active !== false
                    return (
                      <tr
                        key={u.id}
                        className={`border-b border-gray-100 dark:border-gray-700/30 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors ${!isActive ? 'opacity-60' : ''}`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={u.name} size="sm" />
                            <span className="font-medium">{u.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-500 text-xs hidden sm:table-cell">{u.email}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant={isActive ? 'success' : 'danger'}>
                            {isActive ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <AdminScoreEditor
                            id={u.id}
                            currentPoints={u.points ?? 0}
                            onSave={updatePoints}
                          />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant={isActive ? 'danger' : 'secondary'}
                            className="text-xs px-3 py-1"
                            onClick={() => toggleActive(u.id, !isActive)}
                          >
                            {isActive ? 'Desativar' : 'Reativar'}
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
