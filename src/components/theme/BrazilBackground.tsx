import { useBrazilThemeContext } from '../../hooks/useBrazilThemeContext'

export function BrazilBackground() {
  const { active } = useBrazilThemeContext()
  if (!active) return null

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full bg-cover bg-center bg-no-repeat opacity-[0.08] dark:opacity-[0.12]"
      style={{ backgroundImage: 'url(/brazil-bg.svg)' }}
      aria-hidden="true"
    />
  )
}
