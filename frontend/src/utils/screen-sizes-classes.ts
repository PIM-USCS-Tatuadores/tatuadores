import { ScreenSize, ScreenSizeObject } from '@/types/ScreenSize'

type Style = {
  readonly [key: string]: string
}

type ScreenSizesOptions = {
  suffix?: string
}

function getScreenSizesMap(screenSizes: ScreenSizeObject<string>, suffix?: string) {
  return Object.entries(screenSizes)
    .map(([size, modifier]) => {
      if (suffix)
        return `${size}-${suffix}-${modifier}`

      return `${size}-${modifier}`
    })
}

export function getScreenSizesClasses(
  screenSizes: ScreenSizeObject<string>,
  style: Style,
  options: ScreenSizesOptions = {}
) {
  const screenSizesMap = getScreenSizesMap(screenSizes, options.suffix)

  return screenSizesMap.reduce((modifiers, modifier) => {
    modifiers = `${modifiers} ${style[modifier]}`

    return modifiers
  }, '')
}
