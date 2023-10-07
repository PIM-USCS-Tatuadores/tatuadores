import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import FormLayout from '@/components/layouts/form-layout'
import EventForm, { EventFormState } from '@/components/event-form'
import { withSession } from '@/lib/session'
import { Injector } from '@/infra/di/Injector'
import { FlashDay, IFlashDayGateway } from '@/infra/gateways/FlashDay'

dayjs.extend(isSameOrAfter)

export default function EventsEdit(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  const [flashDay, setFlashDay] = useState<FlashDay>()
  const [schema, setSchema] = useState<z.ZodTypeAny>(z.object({}))
  const flashDayGateway = Injector.inject<IFlashDayGateway>('flashDayGateway')
  const [isEditingEvent, setIsEditingEvent] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    flashDayGateway.get(props.id, {
      signal: controller.signal
    }).then(setFlashDay)
    return () => controller.abort()
  }, [])

  useEffect(() => {
    setSchema(
      z.object({
        title: z.string()
          .min(3, { message: 'O título deve conter pelo menos 3 caracteres' }),
        startDate: z.string()
          .refine(arg => dayjs(arg).isSameOrAfter(dayjs(flashDay?.startsAt), 'day'), {
            message: 'A data inicial não pode ser menor do que a cadastrada'
          }),
        endDate: z.string(),
        phone: z.string()
          .min(14, { message: 'Número de telefone inválido' })
      })
      .refine((data) => dayjs(data.endDate).isSameOrAfter(dayjs(data.startDate), 'day'), {
        message: 'A data final deve ser maior ou igual a inicial',
        path: ['endDate']
      })
    )
  }, [flashDay])

  async function handleFormSubmit(state: EventFormState) {
    try {
      setIsEditingEvent(true)
      await flashDayGateway.update(props.id, {
        title: state.title,
        starts_at: state.startDate,
        ends_at: state.endDate,
        phone: state.phone.replace(/\D/g, ''),
        artist_id: props.user.id
      })
      pushUpdateEventSuccessFeedback()
      redirectToEventsList()
    } catch (error) {
      pushUpdateEventErrorFeedback()
      setIsEditingEvent(false)
    }
  }

  function pushUpdateEventSuccessFeedback() {
    const title = flashDay?.name || 'Evento'
    toast(`${title} alterado com sucesso!`, {
      type: 'success',
      theme: 'colored',
      position: 'top-right'
    })
  }

  function pushUpdateEventErrorFeedback() {
    toast('Ocorreu um erro ao alterar, tente novamente!', {
      type: 'success',
      theme: 'colored',
      position: 'top-right'
    })
  }

  function redirectToEventsList() {
    router.push('/admin/events')
  }

  if (!flashDay) {
    return (
      <div></div>
    )
  }


  const startsAt = dayjs(flashDay.startsAt).format('YYYY-MM-DD')
  const endsAt = flashDay.endsAt ? dayjs(flashDay.endsAt).format('YYYY-MM-DD') : undefined

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
        validationSchema={schema}
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
