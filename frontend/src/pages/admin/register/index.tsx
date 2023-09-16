import { useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import { Injector } from '@/infra/di/Injector'
import { IAuthGateway } from '@/infra/gateways/Auth'
import FormLayout from '@/components/layouts/form-layout'
import Button from '@/components/button'
import Flexbox from '@/components/flexbox'
import Input from '@/components/input'
import Link from 'next/link'
import { GetServerSidePropsContext } from 'next'

export default function Register() {
  const router = useRouter()
  const authGateway = Injector.inject<IAuthGateway>('authGateway')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function register(event: FormEvent<HTMLOrSVGElement>) {
    event.preventDefault()
    try {
      await authGateway.register(name, email, password)
      navigateToLogin()
    } catch(error: any) {
      console.log(error.message)
    }
  }

  function navigateToLogin() {
    router.replace('/admin')
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
        onSubmit={register}
      >
        <Flexbox
          tagName="div"
          direction={{ xs: 'column' }}
          gap={{ xs: 'small' }}
        >
          <Input label="Nome">
            <input
              type="text"
              name="name"
              placeholder='Digite o seu nome'
              value={name}
              onChange={({ target }) => setName(target.value)}
              required
            />
          </Input>

          <Input label="Email">
            <input
              type="email"
              name="email"
              placeholder='Digite seu email'
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              required
            />
          </Input>

          <Input label="Senha">
            <input
              type="password"
              name="password"
              placeholder='Digite a sua senha'
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              required
            />
          </Input>
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
