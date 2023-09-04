import { HTMLAttributes, LinkHTMLAttributes } from 'react'

export type CustomElement = HTMLAttributes<HTMLOrSVGElement> & LinkHTMLAttributes<HTMLAnchorElement>
