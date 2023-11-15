import '@/styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { goerli, mainnet, polygon, polygonMumbai, ronin, saigon } from 'viem/chains';
import { WagmiProvider, createConfig } from 'wagmi';
import { coinbaseWallet, injected } from 'wagmi/connectors';

const queryClient = new QueryClient();

const appChains = [mainnet, goerli, polygon, polygonMumbai, ronin, saigon];

const connectors = [
  injected({
    shimDisconnect: true,
  }),
  coinbaseWallet({
    appName: 'testApp',
  }),
];

const config = createConfig({
  chains: appChains,
  connectors,
  ssr: true,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
