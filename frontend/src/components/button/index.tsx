import { Children, cloneElement, isValidElement, ReactNode } from 'react'
import style from './style.module.css'

interface ButtonProps {
  type?: 'primary' | 'secondary' | 'link',
  loading?: boolean,
  children: ReactNode
}

export default function Button({
  type = 'primary',
  loading = false,
  children
}: ButtonProps) {
  const child = Children.only(children)

  const loadingClass = loading ? style['is-loading'] : ''
  const props = { className: `${style.button} ${style[type]} ${loadingClass}` }

  const button = isValidElement(child) ? cloneElement(child, props) : ''

  return <>{button}</>
}
