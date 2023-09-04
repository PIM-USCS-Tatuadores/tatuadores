import { useEffect, useState } from 'react'
import { InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import FormLayout from '@/components/layouts/form-layout'
import EventForm, { EventFormState } from '@/components/event-form'
import { withSession } from '@/lib/session'
import { Injector } from '@/infra/di/Injector'
import { FlashDay, IFlashDayGateway } from '@/infra/gateways/FlashDay'

export default function EventsEdit(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  const [flashDay, setFlashDay] = useState<FlashDay>()
  const flashDayGateway = Injector.inject<IFlashDayGateway>('flashDayGateway')
  const [isEditingEvent, setIsEditingEvent] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    flashDayGateway.get(props.id, {
      signal: controller.signal
    }).then(setFlashDay)
    return () => controller.abort()
  }, [])

  async function handleFormSubmit(state: EventFormState) {
    setIsEditingEvent(true)

    try {
      await flashDayGateway.update(props.id, {
        title: state.title,
        starts_at: state.startDate,
        ends_at: state.endDate,
        phone: state.phone,
        artist_id: props.user.id
      })

      router.push('/admin/events')
    } catch (error) {
      setIsEditingEvent(false)
    }
  }

  if (!flashDay) {
    return (
      <div></div>
    )
  }

  const [startsAt] = flashDay.startsAt.toISOString().split('T')
  const [endsAt] = flashDay.endsAt?.toISOString().split('T') || []

  return (
    <FormLayout
      title="Editar evento"
      center={false}
      backButton
    >
      <EventForm
        id={flashDay.id}
        title={flashDay.name}
        startDate={startsAt}
        endDate={endsAt}
        phone={flashDay.phone}
        loading={isEditingEvent}
        onSubmit={handleFormSubmit}
      />
    </FormLayout>
  )
}

export const getServerSideProps = withSession(async (context, user) => {
  const id = context.query.id as string

  return {
    props: {
      id,
      user
    }
  }
})
