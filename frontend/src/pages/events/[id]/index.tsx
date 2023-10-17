import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import DefaultLayout from '@/components/layouts/default-layout'
import Flexbox from '@/components/flexbox'
import Text from '@/components/text'
import style from './style.module.css'
import { FetchAdapter } from '@/infra/http/FetchAdapter'
import { FlashDayGateway } from '@/infra/gateways/FlashDayGateway'
import { withSession } from '@/lib/session'

function ArtCard(props: any) {
  const { id, title, href, price, size } = props
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
      <Flexbox
        tagName='a'
        direction={{ xs: 'column' }}
        gap={{ xs: 'small' }}
        href={`/arts/${id}`}
        className={style.artLink}
      >
        <img
          src={href}
          alt={`Imagem da arte ${title}`}
          className={style.artImage}
        />

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
