import { Children, cloneElement, isValidElement, ReactNode } from 'react'
import style from './style.module.css'

interface ButtonProps {
  label: string,
  children: ReactNode
}

export default function Input({ label, children }: ButtonProps) {
  const child = Children.only(children)
  const props = { className: `${style.input}` }

  const input = isValidElement(child) ? cloneElement(child, props) : ''

  return (
    <label className={style.inputWrapper}>
      {label}

      {input}
    </label>
  )
}
