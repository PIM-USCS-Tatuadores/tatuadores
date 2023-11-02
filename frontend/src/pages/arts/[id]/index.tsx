import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { FlashDayGateway } from "@/infra/gateways/FlashDayGateway";
import { FetchAdapter } from "@/infra/http/FetchAdapter";
import { withSession } from "@/lib/session";
import DefaultLayout from '@/components/layouts/default-layout'
import Flexbox from '@/components/flexbox'
import Text from '@/components/text'
import Button from '@/components/button'
import style from './style.module.css'

export default function ArtsShow(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  const { id, art, currentUserIsOwner } = props
  const formatPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })

  function navigateToEditArt() {
    console.log('EDIT ART')
  }

  function navigateToContactForm() {
    router.push(`/arts/${id}/contact/new`)
  }

  return (
    <DefaultLayout backButton>
      <section className={style.artWrapper}>
        <img
          src={art.href}
          alt={`Imagem da arte ${art.title}`}
          className={style.artImage}
        />

        <Flexbox
          direction={{ md: 'column' }}
          gap={{ md: 'large' }}
          className={style.artContent}
        >
          <Flexbox
            direction={{ md: 'column' }}
            gap={{ md: 'small' }}
            className={style.artContent}
          >
            <Text
              tagName="h1"
              types={{ xs: 'subtitle', md: 'display' }}
              className={style.artTitle}
            >
              {art.title}
            </Text>

            <Flexbox
              direction={{ xs: 'row' }}
              justifyContent={{ xs: 'space-between' }}
              alignItems={{ xs: 'center' }}
            >
              <Text types={{ xs: 'subtitle' }}>
                {formatPrice.format(art.price)}
              </Text>

              <Text types={{ xs: 'body-1' }}>
                {art.size} cm
              </Text>
            </Flexbox>
          </Flexbox>

          {art.description &&
            <Text types={{ xs: 'body-1' }}>
              {art.description}
            </Text>
          }

          <Button type="secondary">
            {currentUserIsOwner ?
              <button
                type="button"
                onClick={navigateToEditArt}
              >
                Editar arte
              </button>
              :
              <button
                type="button"
                onClick={navigateToContactForm}
              >
                Tenho interesse
              </button>
            }
          </Button>
        </Flexbox>
      </section>
    </DefaultLayout>
  )
}

export const getServerSideProps = withSession(async (context, user) => {
  const id = context.query.id as string
  const httpClient = new FetchAdapter()
  const flashDayGateway = new FlashDayGateway(httpClient)

  try {
    const art = await flashDayGateway.getArt(id)
    const flashDay = await flashDayGateway.get(art.flashDayId as string)
    const currentUserIsOwner = user?.id === flashDay.artistId
    return {
      props: {
        id,
        art,
        currentUserIsOwner
      }
    }
  } catch (error) {
    console.log(error)
    return {
      notFound: true
    }
  }

}, { redirectTo: '' })
