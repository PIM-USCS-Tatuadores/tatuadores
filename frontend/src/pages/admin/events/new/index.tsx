import { useState } from 'react'
import { useRouter } from 'next/router'
import { Injector } from '@/infra/di/Injector'
import { IFlashDayGateway } from '@/infra/gateways/FlashDay'
import { withSession } from '@/lib/session'
import FormLayout from '@/components/layouts/form-layout'
import EventForm from '@/components/event-form'

export default function EventsNew() {
  const router = useRouter()
  const flashDayGateway = Injector.inject<IFlashDayGateway>('flashDayGateway')
  const [isCreatingEvent, setIsCreatingEvent] = useState(false)

  async function handleFormSubmit(state: any) {
    setIsCreatingEvent(true)

    try {
      await flashDayGateway.create({
        title: state.title,
        starts_at: state.startDate,
        ends_at: state.endDate,
        phone: state.phone,
        active: true
      })

      router.push('/admin/events')
    } catch (error) {
      setIsCreatingEvent(false)
    }
  }

  return (
    <FormLayout
      title="Novo evento"
      center={false}
      backButton
    >
      <EventForm
        loading={isCreatingEvent}
        onSubmit={handleFormSubmit}
      />
    </FormLayout>
  )
}

export const getServerSideProps = withSession(async () => ({ props: {} }))
