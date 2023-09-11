import { ReactNode } from 'react'
import { useRouter } from 'next/router'

import BaseLayout from '../base-layout'
import Text from '@/components/text'

import style from './style.module.css'
import Flexbox from '@/components/flexbox'
import Button from '@/components/button'
import Icon from '@/components/icon'

interface FormLayoutProps {
  title: string,
  center: boolean,
  backButton?: boolean,
  children: ReactNode
}

export default function FormLayout(props: FormLayoutProps) {
  const router = useRouter()
  const rootClassName = [style.formLayout, props.center ? style.center : ''].join(' ')

  return (
    <BaseLayout>
      <style jsx global>{`
        @media screen and (max-width: 785px) {
          :root {
            --color-body-background: var(--color-white)
          }
        }
      `}</style>

      <Flexbox
        tagName="main"
        className={rootClassName}
        alignItems={{ xs: props.center ? 'center' : 'start' }}
        justifyContent={{ xs: 'center' }}
      >
        <Flexbox
          className={style.formLayoutContainer}
          direction={{ xs: 'column' }}
          gap={{ xs: 'large' }}
        >
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
              types={{ xs: 'title' }}
            >
              {props.title}
            </Text>
          </Flexbox>

          {props.children}
        </Flexbox>
      </Flexbox>
    </BaseLayout>
  )
}
