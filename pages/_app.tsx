import type { AppProps } from "next/app";
import { Provider as ReduxProvider } from "react-redux";
import store from "store";
import { createClient, WagmiConfig } from "wagmi";
import { injected, providers, walletConnect } from "../connectors";
import "../styles/globals.css";

const client = createClient({
  connectors: [injected, walletConnect],
  provider() {
    return process.env.NODE_ENV === "development"
      ? providers.LOCAL
      : providers.MAINNET;
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider store={store}>
      <WagmiConfig client={client}>
        <Component {...pageProps} />
      </WagmiConfig>
    </ReduxProvider>
  );
}

export default MyApp;
