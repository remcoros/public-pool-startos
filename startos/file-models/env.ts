import { matches, FileHelper } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { envDefaults, mainnet, testnet } from '../utils'

const { object, string, literal, oneOf, allOf, number, literals } = matches

const {
  BITCOIN_RPC_TIMEOUT,
  API_PORT,
  STRATUM_PORT,
  POOL_IDENTIFIER,
  API_SECURE,
} = envDefaults

const shape = object({
  BITCOIN_RPC_TIMEOUT: literal(BITCOIN_RPC_TIMEOUT)
    .defaultTo(BITCOIN_RPC_TIMEOUT)
    .onMismatch(BITCOIN_RPC_TIMEOUT),
  API_PORT: literal(API_PORT).onMismatch(API_PORT),
  STRATUM_PORT: literal(STRATUM_PORT).onMismatch(STRATUM_PORT),
  API_SECURE: literal(API_SECURE).onMismatch(API_SECURE),
  POOL_IDENTIFIER: string.onMismatch(POOL_IDENTIFIER),
  NETWORK: literals(mainnet.NETWORK, testnet.NETWORK).onMismatch(
    mainnet.NETWORK,
  ),
  BITCOIN_RPC_URL: literals(
    mainnet.BITCOIN_RPC_URL,
    testnet.BITCOIN_RPC_URL,
  ).onMismatch(mainnet.BITCOIN_RPC_URL),
  BITCOIN_RPC_PORT: literals(
    mainnet.BITCOIN_RPC_PORT,
    testnet.BITCOIN_RPC_PORT,
  ).onMismatch(mainnet.BITCOIN_RPC_PORT),
  BITCOIN_RPC_COOKIEFILE: literals(
    mainnet.BITCOIN_RPC_COOKIEFILE,
    testnet.BITCOIN_RPC_COOKIEFILE,
  ).onMismatch(mainnet.BITCOIN_RPC_COOKIEFILE),
  BITCOIN_ZMQ_HOST: literals(
    mainnet.BITCOIN_ZMQ_HOST,
    testnet.BITCOIN_ZMQ_HOST,
  ).onMismatch(mainnet.BITCOIN_ZMQ_HOST),
})

export type EnvType = typeof shape._TYPE

export const envFile = FileHelper.env(
  {
    base: sdk.volumes.main,
    subpath: '.env',
  },
  shape,
)
