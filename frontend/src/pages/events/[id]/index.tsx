import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import DefaultLayout from '@/components/layouts/default-layout'
import Flexbox from '@/components/flexbox'
import Text from '@/components/text'
import style from './style.module.css'
import { FetchAdapter } from '@/infra/http/FetchAdapter'
import { FlashDayGateway } from '@/infra/gateways/FlashDayGateway'
import { withSession } from '@/lib/session'

const arts = [
  ['https://i.pinimg.com/736x/a1/5f/6b/a15f6be371382b419a054ba21c551eb7.jpg', 'R$ 300', '15 cm'],
  ['https://i.pinimg.com/originals/52/ce/01/52ce01ebff8c14416f6ae56ad492274b.jpg', 'R$ 150', '8 cm'],
  ['https://i.pinimg.com/236x/95/fe/a8/95fea8e2447fd73135a9d9eec97756e9.jpg', 'R$ 170', '10 cm'],
  ['https://i.pinimg.com/originals/c1/91/43/c19143ee65207e5c6faa14e8fea4da8b.jpg', 'R$ 230', '12 cm'],
  ['https://as1.ftcdn.net/v2/jpg/01/21/71/98/1000_F_121719837_4w49lfQsVqfKqs5bqcLihliA6Qjoz8Wu.jpg', 'R$ 180', '9 cm'],
  ['https://thumbs.dreamstime.com/b/skull-cross-art-tattoo-design-head-mix-tribal-hand-pencil-drawing-paper-55355016.jpg', 'R$ 90', '7 cm']
]

function ArtCard(props: any) {
  const { href, price, size } = props
  const formatPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })

  return (
    <Flexbox
      tagName='li'
      direction={{ xs: 'column' }}
      gap={{ xs: 'small' }}
      className={style.artItem}
    >
      <img src={href} />

      <Flexbox
        direction={{ xs: 'row' }}
        justifyContent={{ xs: 'space-between' }}
        alignItems={{ xs: 'center' }}
      >
        <Text types={{ xs: 'body-1-bold', md: 'subtitle' }}>
          {formatPrice.format(price)}
        </Text>

        <Text types={{ xs: 'body-2', md: 'body-2' }}>
          {size} cm
        </Text>
      </Flexbox>
    </Flexbox>
  )
}

export default function EventDetails(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { currentUserIsOwner, flashDay, arts } = props

  function getActionButton() {
    if (!currentUserIsOwner)
      return {}

    return {
      buttonLabel: 'Nova arte',
      buttonUrl: `/admin/events/${props.id}/arts/new`
    }
  }

  return (
    <DefaultLayout
      title={flashDay.name}
      backButton
      {...getActionButton()}
    >
      <ul className={style.artGrid}>
        {arts.map((art: any) => (
          <ArtCard
            key={art.id}
            {...art}
          />
        ))}
      </ul>
    </DefaultLayout>
  )
}

export const getServerSideProps = withSession(async (context: GetServerSidePropsContext, user) => {
  const id = context.query.id as string
  const httpClient = new FetchAdapter()
  const flashDayGateway = new FlashDayGateway(httpClient)

  try {
    const [flashDay, arts] = await Promise.all([
      await flashDayGateway.get(id),
      await flashDayGateway.getArts(id)
    ])
    const currentUserIsOwner = user?.id === flashDay.artistId
    if (flashDay.active || currentUserIsOwner) {
      return {
        props: {
          id,
          flashDay: {
            name: flashDay.name
          },
          arts,
          currentUserIsOwner
        }
      }
    } else {
      return {
        notFound: true
      }
    }
  } catch {
    return {
      notFound: true
    }
  }
}, { redirectTo: '' })
