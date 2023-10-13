import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import { z } from 'zod'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { Injector } from '@/infra/di/Injector'
import { IFlashDayGateway } from '@/infra/gateways/FlashDay'
import { withSession } from '@/lib/session'
import FormLayout from '@/components/layouts/form-layout'
import EventForm, { EventFormState } from '@/components/event-form'
import { toast } from 'react-toastify'

dayjs.extend(isSameOrAfter)

const schema = z.object({
  title: z.string()
    .min(3, { message: 'O título deve conter pelo menos 3 caracteres' }),
  startDate: z.string()
    .refine(arg => dayjs(arg).isSameOrAfter(dayjs(new Date()), 'day'), { message: 'A data inicial deve ser maior ou igual a atual' }),
  endDate: z.string(),
  phone: z.string()
    .min(14, { message: 'Número de telefone inválido' })
})
.refine((data) => dayjs(data.endDate).isSameOrAfter(dayjs(data.startDate), 'day'), {
  message: 'A data final deve ser maior ou igual a inicial',
  path: ['endDate']
})

export default function EventsNew() {
  const router = useRouter()
  const flashDayGateway = Injector.inject<IFlashDayGateway>('flashDayGateway')
  const [isCreatingEvent, setIsCreatingEvent] = useState(false)

  async function handleFormSubmit(state: EventFormState) {
    try {
      setIsCreatingEvent(true)
      await flashDayGateway.create({
        title: state.title,
        starts_at: state.startDate,
        ends_at: state.endDate,
        phone: state.phone,
        active: true
      })
      pushCreateEventSuccessFeedback()
      redirectToEventsList()
    } catch {
      pushUpdateEventErrorFeedback()
      setIsCreatingEvent(false)
    }
  }

  function pushCreateEventSuccessFeedback() {
    toast('Evento criado com sucesso!', {
      type: 'success',
      theme: 'colored',
      position: 'top-right'
    })
  }

  function pushUpdateEventErrorFeedback() {
    toast('Ocorreu um erro ao cadastrar, tente novamente!', {
      type: 'error',
      theme: 'colored',
      position: 'top-right'
    })
  }

  function redirectToEventsList() {
    router.push('/admin/events')
  }

  return (
    <FormLayout
      title="Novo evento"
      center={false}
      backButton
    >
      <EventForm
        validationSchema={schema}
        loading={isCreatingEvent}
        onSubmit={handleFormSubmit}
      />
    </FormLayout>
  )
}

export const getServerSideProps = withSession(async () => ({ props: {} }))
