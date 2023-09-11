import { useEffect, useState } from 'react'

import Flexbox from '@/components/flexbox'
import Button from '@/components/button'
import Input from '@/components/input'

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
  onSubmit: (state: EventFormState) => void
}

function getToday() {
  const [today] = (new Date()).toISOString().split('T')

  return today
}

export default function EventForm(props: EventFormProps) {
  const { onSubmit: onSubmitHandler, loading = false } = props
  const today = getToday()
  const isEditForm = !!props.id
  const [title, setTitle] = useState(props.title || '')
  const [startDate, setStartDate] = useState(props.startDate || '')
  const [endDate, setEndDate] = useState(props.endDate || '')
  const [phone, setPhone] = useState(props.phone || '')

  function handleFormSubmit(event: any) {
    event.preventDefault()

    onSubmitHandler({
      title,
      startDate,
      endDate,
      phone
    })
  }

  return (
    <Flexbox
      tagName="form"
      direction={{ xs: 'column' }}
      gap={{ xs: 'medium' }}
      onSubmit={handleFormSubmit}
    >
      <Input label="Título">
        <input
          type="text"
          name="title"
          placeholder='Ex: Flash Tattoo'
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          required
        />
      </Input>

      <Flexbox
        direction={{ xs: 'column', md: 'row' }}
        gap={{ xs: 'medium' }}
      >
        <Input label="Data inicial">
          <input
            type="date"
            name="start_date"
            value={startDate}
            min={!isEditForm ? today : props.startDate}
            onChange={({ target }) => setStartDate(target.value)}
            required
          />
        </Input>

        <Input label="Data final">
          <input
            type="date"
            name="end_date"
            value={endDate}
            min={startDate}
            onChange={({ target }) => setEndDate(target.value)}
          />
        </Input>
      </Flexbox>

      <Input label="Whatsapp">
        <input
          type="tel"
          name="phone"
          placeholder='11999999999'
          value={phone}
          onChange={({ target }) => setPhone(target.value)}
          required
        />
      </Input>

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
