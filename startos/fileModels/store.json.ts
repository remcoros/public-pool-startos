import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.looseObject({
  node: z.enum(['bitcoind', 'rbitcoin', 'bitcoind-testnet']).catch('rbitcoin'),
  stratumDisplayAddress: z.string().nullable().catch(null),
  secureStratumDisplayAddress: z.string().nullable().catch(null),
})

export const store = FileHelper.json(
  {
    base: sdk.volumes.main,
    subpath: '/store.json',
  },
  shape,
)
