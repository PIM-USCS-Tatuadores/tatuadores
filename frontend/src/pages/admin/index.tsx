import { useState, FormEvent } from 'react'
import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import { Injector } from '@/infra/di/Injector'
import { IAuthGateway } from '@/infra/gateways/Auth'
import FormLayout from '@/components/layouts/form-layout'
import Button from '@/components/button'
import Flexbox from '@/components/flexbox'
import Input from '@/components/input'
import Link from 'next/link'

export default function Login() {
  const router = useRouter()
  const authGateway = Injector.inject<IAuthGateway>('authGateway')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function login(event: FormEvent<HTMLOrSVGElement>) {
    event.preventDefault()
    try {
      await authGateway.login(email, password)
      redirectToDashboard()
    } catch(error: any) {
      console.log(error.message)
    }
  }

  function redirectToDashboard() {
    router.replace('/admin/events')
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
        onSubmit={login}
      >
        <Flexbox
          tagName="div"
          direction={{ xs: 'column' }}
          gap={{ xs: 'small' }}
        >
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
