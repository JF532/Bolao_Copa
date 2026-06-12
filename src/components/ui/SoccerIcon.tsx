interface SoccerIconProps {
  size?: 'sm' | 'lg'
}

export function SoccerIcon({ size = 'sm' }: SoccerIconProps) {
  const cls = size === 'lg' ? 'w-10 h-10' : 'w-6 h-6'
  return (
    <img
      src="/favicon.svg"
      alt=""
      className={`${cls} dark:invert`}
    />
  )
}
