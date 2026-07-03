'use client'

import { useState } from 'react'
import { getTeamLogo, getTeamLogoPng } from '../lib/team-assets'

interface Props {
  numero: number
  name: string
  size?: number
  className?: string
  reverse?: boolean
}

export default function TeamBadge({ numero, name, size = 24, className = '', reverse = false }: Props) {
  const [currentSrc, setCurrentSrc] = useState<'svg' | 'png' | 'fallback'>('svg')

  const logo = currentSrc === 'fallback' ? (
    <span
      className="inline-flex items-center justify-center rounded-full bg-[#00450d] text-white font-oswald font-bold shrink-0 overflow-hidden"
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {numero}
    </span>
  ) : (
    <img
      src={currentSrc === 'svg' ? getTeamLogo(numero) : getTeamLogoPng(numero)}
      alt={name}
      width={size}
      height={size}
      className="rounded-full object-cover shrink-0"
      style={{ width: size, height: size }}
      onError={() => setCurrentSrc(currentSrc === 'svg' ? 'png' : 'fallback')}
    />
  )

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      {reverse ? <><span>{name}</span>{logo}</> : <>{logo}<span>{name}</span></>}
    </span>
  )
}
