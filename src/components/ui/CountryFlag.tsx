import { useState } from 'react'
import { resolveCountryCode } from '../../utils/countryFlags'

const sizeMap = { sm: 20, md: 28, lg: 40 } as const

interface CountryFlagProps {
  country: string
  size?: keyof typeof sizeMap
}

export function CountryFlag({ country, size = 'md' }: CountryFlagProps) {
  const [error, setError] = useState(false)
  const code = resolveCountryCode(country)
  const w = sizeMap[size]

  if (code === 'unknown') {
    console.warn(`[CountryFlag] Unknown country: "${country}"`)
  }

  if (error || code === 'unknown') {
    return (
      <div
        className="inline-flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded-sm text-gray-400 dark:text-gray-500 text-xs font-bold select-none"
        style={{ width: w, height: Math.round(w * 0.75), minWidth: w }}
        aria-hidden
      >
        ?
      </div>
    )
  }

  return (
    <img
      src={`https://flagcdn.com/${code}.svg`}
      alt={`Bandeira de ${country}`}
      width={w}
      height={Math.round(w * 0.75)}
      loading="lazy"
      onError={() => setError(true)}
      className="inline-block rounded-sm object-contain"
    />
  )
}
