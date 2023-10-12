import { useRouter } from 'next/router'
import DefaultLayout from '@/components/layouts/default-layout'
import Text from '@/components/text'
import Card from '@/components/card'
import Flexbox from '@/components/flexbox'
import style from './style.module.css'
import { useEffect, useState } from 'react'
import { Injector } from '@/infra/di/Injector'
import { withSession } from '@/lib/session'
import { FlashDay, IFlashDayGateway } from '@/infra/gateways/FlashDay'
import { InferGetServerSidePropsType } from 'next'
import EmptyState from '@/components/empty-state'

interface EventCardProps {
  event: FlashDay
}

function getDateString(date: Date | undefined) {
  if (!date) return  ''
  return date.toLocaleDateString()
}

function EventCard(props: EventCardProps) {
  const router = useRouter()
  const flashDay = props.event
  const startDate = getDateString(flashDay.startsAt)
  const endDate = getDateString(flashDay.endsAt)
  const eventPath = `/admin/events/${flashDay.id}/details`
  const eventActiveLabel = flashDay.active ? 'Público' : 'Privado'
  const customStyle = { color: flashDay.active ? 'var(--color-success)' : 'var(--color-warn)' }

  return (
    <Card
      tagName="button"
      onClick={() => router.push(eventPath)}
    >
      <Flexbox
        direction={{ xs: 'column' }}
        gap={{ xs: 'large' }}
      >
        <Flexbox
          direction={{ xs: 'column' }}
          gap={{ xs: 'extrasmall' }}
        >
          <Text
            tagName="h2"
            types={{ xs: 'body-1-bold', md: 'subtitle' }}
          >
            {flashDay.name}
          </Text>

          <Text
            tagName="p"
            types={{ xs: 'caption', md: 'body-2' }}
          >
            {startDate} {endDate ? `à ${endDate}` : ''}
          </Text>
        </Flexbox>

        <Flexbox justifyContent={{ xs: 'space-between' }}>
          <Text
            tagName="p"
            types={{ xs: 'caption-bold', md: 'body-2-bold' }}
            style={customStyle}
          >
            {eventActiveLabel}
          </Text>
        </Flexbox>
      </Flexbox>
    </Card>
  )
}

export default function Events(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [flashDays, setFlashDays] = useState<any[]>()
  const flashDayGateway = Injector.inject<IFlashDayGateway>('flashDayGateway')

  useEffect(() => {
    const user = props.user
    const controller = new AbortController()
    flashDayGateway.getAllById(user.id, {
      signal: controller.signal
    }).then(setFlashDays)
    return () => controller.abort()
  }, [])

  function Feed() {
    if (!flashDays?.length) {
      return (
        <EmptyState
          icon="💡"
          title="Não encontramos nenhum evento ainda"
          message="Comece criando um novo evento"
        />
      )
    }

    return (
      <ul className={style.list}>
        {flashDays.map((flashDay: any) => (
          <li
            key={flashDay.id}
            className={style.listItem}
          >
            <EventCard event={flashDay} />
          </li>
        ))}
      </ul>
    )
  }

  return (
    <DefaultLayout
      title={`Olá, ${props.user?.name || 'Usuário'}!`}
      buttonLabel='Novo evento'
      buttonUrl='/admin/events/new'
    >
      <Feed />
    </DefaultLayout>
  )
}

export const getServerSideProps = withSession(async function(_, user) {
  return {
    props: {
      user
    }
  }
})
