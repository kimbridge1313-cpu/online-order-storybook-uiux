import type { ButtonHTMLAttributes, ReactNode } from 'react'
import './Button.css'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary'
}

export function Button({ children, variant = 'primary', ...props }: ButtonProps) {
  return (
    <button className={`button button--${variant}`} type="button" {...props}>
      {children}
    </button>
  )
}
