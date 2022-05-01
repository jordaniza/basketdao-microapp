import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { WagmiProvider, createClient } from 'wagmi'
import { providers } from 'ethers'
import { Provider as ReduxProvider } from "react-redux";
import store from 'store'


const client = createClient({
  provider(config) {
    return new providers.JsonRpcProvider('http://127.0.0.1:8545')
  }
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider store={store} >
      <WagmiProvider client={client}>
        <Component {...pageProps} />
      </WagmiProvider>
    </ReduxProvider>
  )
}

export default MyApp
