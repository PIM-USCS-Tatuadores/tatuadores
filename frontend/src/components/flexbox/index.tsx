import { ElementType } from 'react'
import { CustomElement } from '@/types/CustomElement'
import { ScreenSizeObject } from '@/types/ScreenSize'

import style from './style.module.css'
import { getScreenSizesClasses } from '@/utils/screen-sizes-classes'

type DirectionType = 'row' | 'column'
type GapType = 'extrasmall' | 'small' | 'medium' | 'large'

type AlignmentType = 'start' | 'end' | 'center'
type AlignItemsType = AlignmentType | 'stretch'
type JustifyContentType = AlignmentType | 'space-between'

interface FlexboxProps extends CustomElement {
  tagName?: ElementType,
  direction?: ScreenSizeObject<DirectionType>,
  alignItems?: ScreenSizeObject<AlignItemsType>,
  justifyContent?: ScreenSizeObject<JustifyContentType>,
  gap?: ScreenSizeObject<GapType>
}

export default function Flexbox({
  tagName: Component = 'div',
  direction = { xs: 'row' },
  alignItems = { xs: 'stretch' },
  justifyContent = { xs: 'start'},
  gap = { xs: 'extrasmall' },
  children,
  className,
  ...props
}: FlexboxProps) {
  const directionClasses = getScreenSizesClasses(direction, style)
  const alignItemsClasses = getScreenSizesClasses(alignItems, style, { suffix: 'align-items' })
  const justifyContentClasses = getScreenSizesClasses(justifyContent, style, { suffix: 'justify-content' })
  const gapClasses = getScreenSizesClasses(gap, style, { suffix: 'gap' })

  const classes = [
    style.flexbox,
    directionClasses,
    alignItemsClasses,
    justifyContentClasses,
    gapClasses,
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
