import { z } from 'zod'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { InferGetServerSidePropsType } from 'next'
import { Injector } from '@/infra/di/Injector'
import { IFlashDayGateway } from '@/infra/gateways/FlashDay'
import { IFileStorageGateway } from '@/infra/gateways/FileStorage'
import { withSession } from '@/lib/session'
import FormLayout from '@/components/layouts/form-layout'
import ArtForm from '@/components/art-form'

const MAX_FILE_SIZE_MB = 5 * 1024 * 1024
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

const schema = z.object({
  title: z.string()
    .min(3, { message: 'O título deve conter pelo menos 3 caracteres' }),
  image: z.any()
    .refine((files) => !!files.length, { message: 'A imagem é obrigatória' })
    .refine((files) => {
      const size = files?.[0]?.size || 0
      return size <= MAX_FILE_SIZE_MB
    }, { message: 'A imagem deve ter no máximo 5MB' })
    .refine((files) => {
      const type = files?.[0]?.type || ''
      return ACCEPTED_FILE_TYPES.includes(type)
    }, { message: 'são aceitos somente arquivos .jpg, .jpeg, .png e .webp'})
    .transform(files => files?.[0])
  ,
  price: z.string()
    .transform((val) => parseInt(val.replace(/\D+/g, ''), 10) / 100)
    .refine((val) => val > 1, { message: 'Deve ser maior do que R$ 1,00' }),
  size: z.coerce.number()
    .min(1, { message: 'O tamanho mínimo deve ser de 1 cm' })
    .max(100, { message: 'O tamanho máximo deve ser de 100 cm' }),
  description: z.string()
    .max(300, { message: 'O título deve conter no máximo 300 caracteres' }),
})

export default function ArtsNew(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  const flashDayGateway = Injector.inject<IFlashDayGateway>('flashDayGateway')
  const fileStorageGateway = Injector.inject<IFileStorageGateway>('fileStorageGateway')
  const [isCreatingEvent, setIsCreatingEvent] = useState(false)

  async function handleFormSubmit(state: z.infer<typeof schema>) {
    setIsCreatingEvent(true)
    try {
      const response = await fileStorageGateway.upload(state.image as File)
      await flashDayGateway.createArt(props.id, {
        title: state.title,
        description: state.description,
        price: state.price,
        size: state.size,
        href: response.url
      })
      pushCreateArtSuccessFeedback()
      redirectToEventsPage()
    } catch(error: any) {
      pushUpdateEventErrorFeedback()
    } finally {
      setIsCreatingEvent(false)
    }
  }

  function pushCreateArtSuccessFeedback() {
    toast('Arte criada com sucesso!', {
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

  function redirectToEventsPage() {
    router.replace(`/events/${props.id}`)
  }

  return (
    <FormLayout
      title="Nova arte"
      center={false}
      backButton
    >
      <ArtForm
        loading={isCreatingEvent}
        onSubmit={handleFormSubmit}
        validationSchema={schema}
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
