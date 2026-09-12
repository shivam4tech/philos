import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { usePressable } from '@/interact/micro'
import type { SfxName } from '@/audio/sfx'

/** Institutional button — physical press, restrained sound. */
export interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'ghost' | 'danger'
  sfx?: SfxName | false
  children: ReactNode
}

export function Btn({ variant = 'default', sfx = 'click', className, children, disabled, onClick, ...rest }: BtnProps) {
  const pressable = usePressable({ sfx, disabled })
  return (
    <button
      {...rest}
      {...pressable}
      disabled={disabled}
      className={`btn btn--${variant}${className ? ` ${className}` : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export function Microlabel({ children, signal }: { children: ReactNode; signal?: boolean }) {
  return <span className={`microlabel${signal ? ' microlabel--signal' : ''}`}>{children}</span>
}
