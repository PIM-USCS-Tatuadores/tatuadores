import { ElementType } from 'react'
import { ScreenSizeObject } from '@/types/ScreenSize'
import { CustomElement } from '@/types/CustomElement'
import { getScreenSizesClasses } from '@/utils/screen-sizes-classes'
import style from './style.module.css'

type TextType =
  'display' |
  'title' |
  'subtitle' |
  'body-1' |
  'body-2' |
  'caption' |
  'body-1-bold' |
  'body-2-bold' |
  'caption-bold'

type TextTypes = ScreenSizeObject<TextType>

interface TextProps extends CustomElement {
  tagName?: ElementType,
  types?: TextTypes
}

export default function Text({
  tagName: Component = 'div',
  types = { xs: 'body-1' },
  children,
  className,
  ...props
}: TextProps) {
  const typeClasses = getScreenSizesClasses(types, style)

  const classes = [
    style.text,
    typeClasses,
    className
  ].join(' ')

  return (
    <Component
      className={classes}
      {...props}
    >
      {children}
    </Component>
  )
}
