import { ElementType } from 'react'
import { CustomElement } from '@/types/CustomElement'

import style from './style.module.css'

interface CardProps extends CustomElement {
  tagName?: ElementType;
}

export default function Card({
  tagName: Component = 'div',
  className,
  ...props
}: CardProps) {
  className = [style.card, className].join(' ')

  return (
    <Component
      className={className}
      {...props}
    >
      {props.children}
    </Component>
  )
}
