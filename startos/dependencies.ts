import { autoconfig } from 'bitcoin-core-startos/startos/actions/config/autoconfig'
import { i18n } from './i18n'
import { bitcoindDescription } from './manifest/i18n'
import { sdk } from './sdk'
import { store } from './fileModels/store.json'

const bitcoind = sdk.Dependency.optional('bitcoind', {
  enabled: async ({ effects }) =>
    (await store.read((s) => s.node).const(effects)) !== 'rbitcoin',
  description: bitcoindDescription,
  metadata: {
    title: 'Bitcoin Core',
    icon: 'https://raw.githubusercontent.com/Start9Labs/bitcoin-core-startos/feec0b1dae42961a257948fe39b40caf8672fce1/dep-icon.svg',
  },
  versionRange:
    '(>=28.4:29 && <29) || (>=29.4:16 && <30) || (>=30.3:16 && <31) || >=31.1:16 || >=#knotsprerdts:29.3:29',
  kind: 'running',
  healthChecks: ['bitcoind'],
}).withInit(async (effects) => {
  await sdk.action.createTask(effects, 'bitcoind', autoconfig, 'critical', {
    input: {
      kind: 'partial',
      accept: [{ zmqEnabled: true }],
      set: { zmqEnabled: true },
    },
    reason: i18n('Must enable ZMQ in Bitcoin to use it with Public Pool'),
    when: { condition: 'input-not-matches', once: false },
  })
})

const rbitcoin = sdk.Dependency.optional('rbitcoin', {
  description: bitcoindDescription,
  metadata: {
    title: 'rbitcoin',
    icon: 'https://raw.githubusercontent.com/remcoros/rbitcoin-startos/dc2eaf1012618940b4743c816c9b036bbb720953/icon.png',
  },
  versionRange: '>=0.9.2:0',
  kind: 'running',
  healthChecks: ['rpc'],
  enabled: async ({ effects }) =>
    (await store.read((s) => s.node).const(effects)) === 'rbitcoin',
})

export const dependencies = sdk.Dependencies.of()
  .addDependency(bitcoind)
  .addDependency(rbitcoin)
