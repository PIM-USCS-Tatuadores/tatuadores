import { useState } from "react";
import { z } from 'zod'
import { InferGetServerSidePropsType } from "next";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import VMasker from 'vanilla-masker'
import FormLayout from '@/components/layouts/form-layout'
import Flexbox from '@/components/flexbox'
import Button from '@/components/button'
import Input from '@/components/input'
import Text from '@/components/text'
import ErrorMessage from '@/components/error-message'
import { Injector } from "@/infra/di/Injector";
import { IFlashDayGateway } from "@/infra/gateways/FlashDay";
import { toast } from "react-toastify";
import { withSession } from "@/lib/session";
import { FetchAdapter } from "@/infra/http/FetchAdapter";
import { FlashDayGateway } from "@/infra/gateways/FlashDayGateway";
import { useRouter } from "next/router";

const schema = z.object({
  name: z.string().min(3, { message: 'O nome deve conter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  phone: z.string().min(14, { message: 'Número de telefone inválido' }),
  agreed: z.boolean({ invalid_type_error: 'Deve ser um boleano' })
})

type ContactFormState = z.infer<typeof schema>

function maskPhone(value: string) {
  return VMasker.toPattern(value, "(99) 99999-9999")
}

export default function ContactsNew(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  const flashDayGateway = Injector.inject('flashDayGateway') as IFlashDayGateway
  const [isCreatingContact, setIsCreatingContact] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ContactFormState>({
    resolver: zodResolver(schema)
  })

  async function createContact(state: ContactFormState) {
    try {
      setIsCreatingContact(true)
      await flashDayGateway.createContact(props.id, {
        name: state.name,
        email: state.email,
        phone: state.phone.replace(/\D/g, ''),
        accept_contact: state.agreed
      })
      pushCreateContactSuccessFeedback()
      sendWhatsAppMessage()
      redirectToFlashDayPage()
    } catch {
      pushCreateContactErrorFeedback()
      setIsCreatingContact(false)
    }
  }

  function pushCreateContactSuccessFeedback() {
    toast('Contato criado com sucesso!', {
      type: 'success',
      theme: 'colored',
      position: 'top-right'
    })
  }

  function pushCreateContactErrorFeedback() {
    toast('Ocorreu um erro ao entrar em contato, tente novamente!', {
      type: 'error',
      theme: 'colored',
      position: 'top-right'
    })
  }

  function redirectToFlashDayPage() {
    router.replace(`/events/${props.flashDay.id}`)
  }

  function sendWhatsAppMessage() {
    const url = new URL(`/55${props.flashDay.phone}`, 'https://wa.me')
    url.searchParams.set('text', `Olá, tudo bem?\n\nGostaria de marcar um horário para fazer a tatuagem ${props.art.title} do evento ${props.flashDay.name}!\n\nValeu!`)
    window.open(url.href, '_blank')
  }

  return (
    <FormLayout
      title="Entrar em Contato"
      center={false}
      backButton
    >
      <Flexbox
        tagName="form"
        direction={{ xs: 'column' }}
        gap={{ xs: 'medium' }}
        onSubmit={handleSubmit(createContact)}
      >
        <Flexbox
          tagName="div"
          direction={{ xs: 'column' }}
          gap={{ xs: 'extrasmall' }}
        >
          <Input label="Nome">
            <input
              type="text"
              id="nome"
              placeholder='Ex: Fulano de Tal'
              {...register('name')}
            />
          </Input>

          <ErrorMessage message={errors.name?.message} />
        </Flexbox>

        <Flexbox
          tagName="div"
          direction={{ xs: 'column' }}
          gap={{ xs: 'extrasmall' }}
        >
          <Input label="Email">
            <input
              type="text"
              id="email"
              placeholder='Ex: fulano@gmail.com'
              {...register('email')}
            />
          </Input>

          <ErrorMessage message={errors.email?.message} />
        </Flexbox>

        <Flexbox
          tagName="div"
          direction={{ xs: 'column' }}
          gap={{ xs: 'extrasmall' }}
        >
          <Input label="Telefone">
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

        <Flexbox
          tagName="div"
          direction={{ xs: 'row' }}
          gap={{ xs: 'extrasmall' }}
          alignItems={{ xs: 'center' }}
        >
          <input
            type="checkbox"
            id="agreed"
            {...register('agreed')}
          />

          <Text
            tagName="label"
            htmlFor="agreed"
            types={{ xs: 'body-2' }}
          >
            Desejo receber comunicações futuras
          </Text>
        </Flexbox>

        <Button
          type='secondary'
          loading={isCreatingContact}
        >
          <button type="submit">
            Mandar mensagem
          </button>
        </Button>
      </Flexbox>
    </FormLayout>
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

    if (currentUserIsOwner) {
      return {
        notFound: true
      }
    }

    return {
      props: {
        id,
        art: {
          id: art.id,
          title: art.title
        },
        flashDay: {
          id: flashDay.id,
          name: flashDay.name,
          phone: flashDay.phone
        }
      }
    }
  } catch (error) {
    return {
      notFound: true
    }
  }
}, { redirectTo: '' })
