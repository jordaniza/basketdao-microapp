import type { AppProps } from "next/app";
import { Provider as ReduxProvider } from "react-redux";
import { createClient, WagmiConfig } from "wagmi";
import { injected, provider, walletConnect } from "../connectors";
import { wrapper } from "../store";
import "../styles/globals.css";

const client = createClient({
  connectors: [injected, walletConnect],
  provider,
});

function MyApp({ Component, ...rest }: AppProps) {
  const { props, store } = wrapper.useWrappedStore(rest);
  return (
    <ReduxProvider store={store}>
      <WagmiConfig client={client}>
        <Component {...props.pageProps} />
      </WagmiConfig>
    </ReduxProvider>
  );
}

export default MyApp;
