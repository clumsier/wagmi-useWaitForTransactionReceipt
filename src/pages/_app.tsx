import '@/styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { createClient, createWalletClient, custom, http, publicActions } from 'viem';
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
  // client({ chain }) {
  //   if (typeof window !== 'undefined') {
  //     const chainData = appChains.find((appChain) => {
  //       return appChain.id === chain.id;
  //     });

  //     if (chainData && chainData.rpcUrls.default) {
  //       const isRoninChain = chainData.type === 'ronin';
  //       const windowTyped = window as unknown as WindowWithEthereum;
  //       let customWindowProvider;

  //       if (isRoninChain && windowTyped.ronin?.provider) {
  //         customWindowProvider = windowTyped.ronin.provider;
  //       } else if (windowTyped.ethereum) {
  //         customWindowProvider = windowTyped.ethereum;
  //       }

  //       if (customWindowProvider) {
  //         return createWalletClient({
  //           chain: chainData,
  //           transport: custom(customWindowProvider),
  //           key: isRoninChain ? 'Ronin Window Provider' : 'Window Provider',
  //           name: isRoninChain ? 'Ronin Window Provider' : 'Window Provider',
  //         }).extend(publicActions);
  //       }
  //     }
  //   }

  //   return createClient({
  //     chain,
  //     transport: http(),
  //   });
  // },
  transports: {
    [goerli.id]: http(process.env.NEXT_PUBLIC_GOERLI_RPC),
  },
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
