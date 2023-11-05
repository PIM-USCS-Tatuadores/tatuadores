import { HTMLAttributes, LabelHTMLAttributes, LinkHTMLAttributes } from 'react'

export type CustomElement =
  HTMLAttributes<HTMLOrSVGElement> &
  LinkHTMLAttributes<HTMLAnchorElement> &
  LabelHTMLAttributes<HTMLLabelElement>
