import { ReactNode } from 'react'
import Head from 'next/head'

import style from './style.module.css'

interface DefaultLayoutProps {
  children: ReactNode
}

export default function BaseLayout({ children }: DefaultLayoutProps) {
  return (
    <div className={style.baseLayout}>
      <Head>
        <title>Tatuadores</title>
        <meta name="description" content="Aplicação para Tatuadores" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {children}
    </div>
  )
}
