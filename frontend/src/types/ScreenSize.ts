type Sizes = {
  xs: string,
  md: string
}

export type ScreenSize = keyof Sizes
export type ScreenSizeObject<T> = { [key in ScreenSize]?: T }
