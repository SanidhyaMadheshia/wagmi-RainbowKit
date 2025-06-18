import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, anvil } from 'wagmi/chains'

export const config = createConfig({
  chains: [ anvil],
  ssr : true,
  transports: {
    [anvil.id] : http("http://127.0.0.1:8545")
  },
})
