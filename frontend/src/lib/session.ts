import { User } from "@/infra/gateways/Auth";
import { AuthGateway } from "@/infra/gateways/AuthGateway";
import { FetchAdapter } from "@/infra/http/FetchAdapter";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

export function withSession(
  fn: GetServerSidePropsWithSession,
  options: WithSessionOptions = { signedIn: false, redirectTo: '/admin' }
) {
  const httpClient = new FetchAdapter()
  const authGateway = new AuthGateway(httpClient)

  return async function(context: GetServerSidePropsContext) {
    const cookies = context.req.headers['cookie']
    try {
      const user = await authGateway.getUser({
        headers: {
          'Cookie': cookies
        }
      })
      return fn(context, user)
    } catch {
      context.res.setHeader('Set-Cookie', ['token=; Path=/'])
      return {
        redirect: {
          destination: '/admin',
          permanent: false,
        }
      }
    }
  }
}

type GetServerSidePropsWithSession = (
  context: GetServerSidePropsContext,
  user: User | undefined
) => Promise<GetServerSidePropsResult<any>>

type WithSessionOptions = {
  redirectTo: string,
  signedIn: boolean
}
