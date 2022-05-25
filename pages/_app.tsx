import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { WagmiConfig, createClient } from 'wagmi'
import { providers } from '../connectors'
import { Provider as ReduxProvider } from "react-redux";
import store from 'store'

const client = createClient({
  provider() {
    return process.env.NODE_ENV === 'development' ? providers.LOCAL : providers.MAINNET;
  }
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider store={store} >
      <WagmiConfig client={client}>
        <Component {...pageProps} />
      </WagmiConfig>
    </ReduxProvider>
  )
}

export default MyApp
