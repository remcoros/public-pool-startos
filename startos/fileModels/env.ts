import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z
  .object({
    BITCOIN_RPC_TIMEOUT: z.literal('10000').catch('10000'),
    API_PORT: z.literal('3334').catch('3334'),
    STRATUM_PORT: z.literal('3333').catch('3333'),
    API_SECURE: z.literal('false').catch('false'),
    POOL_IDENTIFIER: z.string().catch('Public-Pool on StartOS'),
    // Bitcoin's address is dynamic and resolved over the bridge — main.ts writes
    // these when bitcoind is reachable, so they stay absent until it resolves.
    BITCOIN_RPC_URL: z.string().optional().catch(undefined),
    BITCOIN_RPC_PORT: z.string().optional().catch(undefined),
    BITCOIN_RPC_COOKIEFILE: z.string().catch('/mnt/bitcoind/.cookie'),
    BITCOIN_ZMQ_HOST: z.string().optional().catch(undefined),
    NETWORK: z.enum(['mainnet', 'testnet']).catch('mainnet'),
    // Pinned empty, not omitted. Upstream splits the coinbase 1.5%/98.5% with
    // whatever address this holds once a miner is at or above 50 TH/s, and never
    // checks it is an address at all — a junk value makes every job throw. The
    // file model preserves keys it does not name, so leaving it out of the shape
    // let a line planted on the volume (by a restored backup, say) survive every
    // wrapper write. Naming it means each merge coerces it back to empty, and
    // upstream pays the miner 100% when it is empty.
    DEV_FEE_ADDRESS: z.literal('').catch(''),
  })
  .catchall(z.string())

export type EnvType = z.infer<typeof shape>

export const envFile = FileHelper.env(
  {
    base: sdk.volumes.main,
    subpath: '.env',
  },
  shape,
)
