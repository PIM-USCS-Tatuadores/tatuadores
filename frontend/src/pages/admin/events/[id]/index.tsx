import { InferGetServerSidePropsType } from 'next'
import { withSession } from '@/lib/session'
import { Injector } from '@/infra/di/Injector'
import { FlashDay, IFlashDayGateway } from '@/infra/gateways/FlashDay'
import { useEffect, useState } from 'react'
import DefaultLayout from '@/components/layouts/default-layout'
import Flexbox from '@/components/flexbox'
import Text from '@/components/text'
import style from './style.module.css'

const arts = [
  ['https://i.pinimg.com/736x/a1/5f/6b/a15f6be371382b419a054ba21c551eb7.jpg', 'R$ 300', '15 cm'],
  ['https://i.pinimg.com/originals/52/ce/01/52ce01ebff8c14416f6ae56ad492274b.jpg', 'R$ 150', '8 cm'],
  ['https://i.pinimg.com/236x/95/fe/a8/95fea8e2447fd73135a9d9eec97756e9.jpg', 'R$ 170', '10 cm'],
  ['https://i.pinimg.com/originals/c1/91/43/c19143ee65207e5c6faa14e8fea4da8b.jpg', 'R$ 230', '12 cm'],
  ['https://as1.ftcdn.net/v2/jpg/01/21/71/98/1000_F_121719837_4w49lfQsVqfKqs5bqcLihliA6Qjoz8Wu.jpg', 'R$ 180', '9 cm'],
  ['https://thumbs.dreamstime.com/b/skull-cross-art-tattoo-design-head-mix-tribal-hand-pencil-drawing-paper-55355016.jpg', 'R$ 90', '7 cm']
]

function ArtCard(props: any) {
  const [imagePath, price, size] = arts[props.index]

  return (
    <Flexbox
      tagName='li'
      direction={{ xs: 'column' }}
      gap={{ xs: 'small' }}
      className={style.artItem}
    >
      <img src={imagePath} />

      <Flexbox
        direction={{ xs: 'row' }}
        justifyContent={{ xs: 'space-between' }}
        alignItems={{ xs: 'center' }}
      >
        <Text types={{ xs: 'body-1-bold', md: 'subtitle' }}>
          {price}
        </Text>

        <Text types={{ xs: 'body-2', md: 'body-2' }}>
          {size}
        </Text>
      </Flexbox>
    </Flexbox>
  )
}

export default function EventDetails(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const flashDayGateway = Injector.inject<IFlashDayGateway>('flashDayGateway')
  const list = new Array(3 * 6).fill(0).map(() => (
    Math.floor(Math.random() * arts.length)
  ))
  const [flashDay, setFlashDay] = useState<FlashDay>()

  useEffect(() => {
    const controller = new AbortController()
    flashDayGateway.get(props.id, {
      signal: controller.signal
    }).then(setFlashDay)
    return () => controller.abort()
  }, [])

  if (!flashDay) {
    return (
      <div></div>
    )
  }

  return (
    <DefaultLayout
      title={flashDay?.name || ''}
      buttonLabel="Nova arte"
      buttonUrl="#"
      backButton
    >
      <ul className={style.artGrid}>
        {list.map((index: number) => (
          <ArtCard
            index={index}
            key={index}
          />
        ))}
      </ul>
    </DefaultLayout>
  )
}

export const getServerSideProps = withSession(async (context) => {
  const id = context.query.id as string
  return {
    props: {
      id
    }
  }
})
