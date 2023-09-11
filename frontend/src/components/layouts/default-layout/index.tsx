import { ReactNode } from 'react'
import { useRouter } from 'next/router'

import BaseLayout from '../base-layout'

import Text from '@/components/text'
import Button from '@/components/button'
import Flexbox from '@/components/flexbox'
import Icon from '@/components/icon'

import style from './style.module.css'

interface DefaultLayoutProps {
  title: string,
  buttonLabel: string,
  buttonUrl?: string,
  buttonAction?: () => void,
  buttonLoading?: boolean,
  backButton?: boolean,
  children: ReactNode
}

export default function DefaultLayout(props: DefaultLayoutProps) {
  const router = useRouter()

  return (
    <BaseLayout>
      <main className={style.defaultLayout}>
        <Flexbox
          direction={{ xs: 'column' }}
          gap={{ xs: 'small' }}
        >
          {props.backButton &&
            <Button type='link'>
              <button
                type="button"
                onClick={() => router.back()}
              >
                <Icon
                  name="chevron_left"
                  sizes={{ xs: 'medium' }}
                />

                voltar
              </button>
            </Button>
          }

          <Text
            tagName="h1"
            types={{ xs: 'title', md: 'display' }}
          >
            {props.title}
          </Text>
        </Flexbox>

        <div className={style.defaultLayoutContainer}>
          {props.children}
        </div>

        <Button
          loading={props.buttonLoading}
          type="secondary"
        >
          {props.buttonAction ?
            <button
              type="button"
              onClick={props.buttonAction}
            >
              { props.buttonLabel }
            </button>
            :
            <a href={props.buttonUrl}>
              {props.buttonLabel}
            </a>
          }
        </Button>
      </main>
    </BaseLayout>
  )
}
