/**
 * Verificar ícones disponíveis no link:
 * https://marella.me/material-icons/demo/
 */

import { ScreenSizeObject } from '@/types/ScreenSize'

import style from './style.module.css'
import { getScreenSizesClasses } from '@/utils/screen-sizes-classes'

type IconSizeType = 'extrasmall' | 'small' | 'medium' | 'large'

interface IconProps {
  name: string,
  sizes?: ScreenSizeObject<IconSizeType>
}

export default function Icon({
  name,
  sizes = { xs: 'small' }
}: IconProps) {
  const iconSizeClasses = getScreenSizesClasses(sizes, style)
  const classes = ['material-icons', style.icon, iconSizeClasses].join(' ')

  return (
    <span className={classes}>
      {name}
    </span>
  )
}
