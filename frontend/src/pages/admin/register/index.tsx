import { z } from 'zod'
import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Injector } from '@/infra/di/Injector'
import { IAuthGateway } from '@/infra/gateways/Auth'
import FormLayout from '@/components/layouts/form-layout'
import Button from '@/components/button'
import Flexbox from '@/components/flexbox'
import Input from '@/components/input'
import ErrorMessage from '@/components/error-message'

const schema = z.object({
  name: z.string().min(3, { message: 'O nome deve conter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'A senha deve conter pelo menos 6 caracteres' })
})

type ValidationSchema = z.infer<typeof schema>

export default function Register() {
  const router = useRouter()
  const authGateway = Injector.inject<IAuthGateway>('authGateway')
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ValidationSchema>({ resolver: zodResolver(schema) })

  async function createUser(data: ValidationSchema) {
    const { name, email, password } = data
    try {
      await authGateway.register(name, email, password)
      pushRegisterSuccessFeedback()
      navigateToLogin()
    } catch(error: any) {
      pushRegisterErrorFeedback()
    }
  }

  function navigateToLogin() {
    router.replace('/admin')
  }

  function pushRegisterSuccessFeedback() {
    toast("Cadastro realizado com sucesso, por favor faça o login!", {
      type: 'success',
      theme: 'colored',
      position: 'top-right'
    })
  }

  function pushRegisterErrorFeedback() {
    toast("Ocorreu um erro ao cadastrar, tente novamente!", {
      type: 'error',
      theme: 'colored',
      position: 'top-right'
    })
  }

  return (
    <FormLayout
      title="Cadastrar"
      center
    >
      <Flexbox
        tagName="form"
        direction={{ xs: 'column' }}
        gap={{ xs: 'medium' }}
        onSubmit={handleSubmit(createUser)}
      >
        <Flexbox
          tagName="div"
          direction={{ xs: 'column' }}
          gap={{ xs: 'small' }}
        >
          <Flexbox
            tagName="div"
            direction={{ xs: 'column' }}
            gap={{ xs: 'extrasmall' }}
          >
            <Input label="Nome">
              <input
                type="text"
                id="name"
                placeholder='Digite o seu nome'
                {...register("name")}
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
                placeholder='Digite seu email'
                {...register("email")}
              />
            </Input>

            <ErrorMessage message={errors.email?.message} />
          </Flexbox>

          <Flexbox
            tagName="div"
            direction={{ xs: 'column' }}
            gap={{ xs: 'extrasmall' }}
          >
            <Input label="Senha">
              <input
                type="password"
                id="password"
                placeholder='Digite a sua senha'
                {...register("password")}
              />
            </Input>

            <ErrorMessage message={errors.password?.message} />
          </Flexbox>
        </Flexbox>

        <Button type="secondary">
          <button type="submit">
            Cadastrar
          </button>
        </Button>

        <Button type="link">
          <Link
            href="/admin"
            style={{ width: '100%' }}
          >
            Já tenho conta
          </Link>
        </Button>
      </Flexbox>
    </FormLayout>
  )
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.token

  if (token) {
    return {
      redirect: {
        destination: '/admin/events',
        permanent: false
      }
    }
  }

  return { props: {} }
}
