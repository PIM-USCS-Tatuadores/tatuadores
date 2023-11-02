import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import VMasker from 'vanilla-masker'
import FormLayout from '@/components/layouts/form-layout'
import Flexbox from '@/components/flexbox'
import Button from '@/components/button'
import Input from '@/components/input'
import ErrorMessage from '@/components/error-message'

const schema = z.object({
  name: z.string().min(3, { message: 'O nome deve conter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  phone: z.string().min(14, { message: 'Número de telefone inválido' })
})

type ContactFormState = z.infer<typeof schema>

function maskPhone(value: string) {
  return VMasker.toPattern(value, "(99) 99999-9999")
}

export default function ContactsNew(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ContactFormState>({
    resolver: zodResolver(schema)
  })

  function createContact() {
    console.log('CREATE CONTACT')
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

        <Button type='secondary'>
          <button type="submit">
            Mandar mensagem
          </button>
        </Button>
      </Flexbox>
    </FormLayout>
  )
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.query.id as string

  return {
    props: {
      id
    }
  }
}
