import { GetServerSidePropsContext } from 'next'

export function redirect(
  context: GetServerSidePropsContext,
  status: number,
  location: string
) {
  context.res.writeHead(status, { Location: location })
  context.res.end()
}
