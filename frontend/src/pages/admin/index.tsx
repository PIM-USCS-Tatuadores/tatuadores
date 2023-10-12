import { z } from 'zod'
import { useState, FormEvent } from 'react'
import { GetServerSidePropsContext } from 'next'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
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
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'A senha deve conter pelo menos 6 caracteres' })
})

type ValidationSchema = z.infer<typeof schema>

export default function Login() {
  const router = useRouter()
  const authGateway = Injector.inject<IAuthGateway>('authGateway')
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ValidationSchema>({ resolver: zodResolver(schema) })

  async function login(data: ValidationSchema) {
    const { email, password } = data
    try {
      await authGateway.login(email, password)
      pushLoginSuccessFeedback()
      redirectToDashboard()
    } catch {
      pushLoginErrorFeedback()
    }
  }

  function redirectToDashboard() {
    router.replace('/admin/events')
  }

  function pushLoginSuccessFeedback() {
    toast("Login realizado com sucesso!", {
      type: 'success',
      theme: 'colored',
      position: 'top-right'
    })
  }

  function pushLoginErrorFeedback() {
    toast("Email ou senha inválidos!", {
      type: 'error',
      theme: 'colored',
      position: 'top-right',
      closeOnClick: true
    })
  }

  return (
    <FormLayout
      title="Entrar"
      center
    >
      <Flexbox
        tagName="form"
        direction={{ xs: 'column' }}
        gap={{ xs: 'medium' }}
        onSubmit={handleSubmit(login)}
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
            Entrar
          </button>
        </Button>

        <Button type="link">
          <Link
            href="/admin/register"
            style={{ width: '100%' }}
          >
            Ainda não tenho conta
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
