import '@/styles/globals.css'
import 'material-icons/iconfont/material-icons.css'
import 'react-toastify/dist/ReactToastify.min.css'
import { Provider } from '@/infra/di/Provider'
import { AuthGateway } from '@/infra/gateways/AuthGateway'
import { FlashDayGateway } from '@/infra/gateways/FlashDayGateway'
import { FetchAdapter } from '@/infra/http/FetchAdapter'
import { Session } from '@/infra/http/Session'
import { ToastContainer } from 'react-toastify'
import type { AppProps } from 'next/app'
import { Roboto } from 'next/font/google'
import { FileStorageGateway } from '@/infra/gateways/FileStorageGateway'

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-roboto'
})

function App({ Component, pageProps }: AppProps) {
  const http = new FetchAdapter()
  Provider.provide('authGateway', new AuthGateway(http))
  Provider.provide('flashDayGateway', new FlashDayGateway(http))
  Provider.provide('fileStorageGateway', new FileStorageGateway())
  new Session()

  return (
    <div
      className={roboto.className}
      style={{ display: 'contents' }}
    >
      <Component {...pageProps} />
      <ToastContainer />
    </div>
  )
}

export default App
