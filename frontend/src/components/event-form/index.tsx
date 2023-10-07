import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import VMasker from 'vanilla-masker'
import Flexbox from '@/components/flexbox'
import Button from '@/components/button'
import Input from '@/components/input'
import ErrorMessage from '@/components/error-message'

export interface EventFormState {
  title: string,
  startDate: string,
  endDate: string,
  phone: string,
}

interface EventFormProps {
  id?: string,
  title?: string,
  startDate?: string,
  endDate?: string,
  phone?: string,
  loading?: boolean,
  validationSchema: z.ZodTypeAny,
  onSubmit: (state: EventFormState) => void
}

function normalizeDate(date: Date) {
  if (!date) return ''
  const [string] = date.toISOString().split('T')
  return string
}

function toDate(value: string, context: z.RefinementCtx) {
  return new Date(value + 'T00:00:00')
}

function maskPhone(value: string) {
  return VMasker.toPattern(value, "(99) 99999-9999")
}

export default function EventForm(props: EventFormProps) {
  const today = normalizeDate(new Date())
  const isEditForm = !!props.id
  const { onSubmit: onSubmitHandler, loading = false } = props
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<EventFormState>({
    resolver: zodResolver(props.validationSchema),
    defaultValues: {
      title: props.title,
      startDate: props.startDate,
      endDate: props.endDate,
      phone: maskPhone(props.phone || '')
    }
  })

  function submit(data: EventFormState) {
    const { title, startDate, endDate, phone } = data

    onSubmitHandler({
      title,
      startDate,
      endDate,
      phone: phone.replace(/\D/g, '')
    })
  }

  return (
    <Flexbox
      tagName="form"
      direction={{ xs: 'column' }}
      gap={{ xs: 'medium' }}
      onSubmit={handleSubmit(submit)}
    >
      <Flexbox
        tagName="div"
        direction={{ xs: 'column' }}
        gap={{ xs: 'extrasmall' }}
      >
        <Input label="Título">
          <input
            type="text"
            id="title"
            placeholder='Ex: Flash Tattoo'
            {...register('title')}
          />
        </Input>

        <ErrorMessage message={errors.title?.message} />
      </Flexbox>

      <Flexbox
        tagName="div"
        direction={{ xs: 'column' }}
        gap={{ xs: 'extrasmall' }}
      >
        <Input label="Data inicial">
          <input
            type="date"
            id="startDate"
            {...register('startDate')}
          />
        </Input>

        <ErrorMessage message={errors.startDate?.message} />
      </Flexbox>

      <Flexbox
        tagName="div"
        direction={{ xs: 'column' }}
        gap={{ xs: 'extrasmall' }}
      >
        <Input label="Data final">
          <input
            type="date"
            id="endDate"
            {...register('endDate')}
          />
        </Input>

        <ErrorMessage message={errors.endDate?.message} />
      </Flexbox>

      <Flexbox
        tagName="div"
        direction={{ xs: 'column' }}
        gap={{ xs: 'extrasmall' }}
      >
        <Input label="Whatsapp">
          <input
            type="tel"
            id="phone"
            placeholder='(99) 99999-9999'
            {...register('phone', {
              onChange: (event) => {
                const { value } = event.target
                event.target.value = maskPhone(value)
              }
            })}
          />
        </Input>

        <ErrorMessage message={errors.phone?.message} />
      </Flexbox>

      <Button
        type='secondary'
        loading={loading}
      >
        <button type="submit">
          {isEditForm ? 'Editar evento' : 'Criar evento'}
        </button>
      </Button>
    </Flexbox>
  )
}
