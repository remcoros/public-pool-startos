import { autoconfig } from 'bitcoin-core-startos/startos/actions/config/autoconfig'
import { autoconfig as testnetAutoconfig } from 'bitcoin-core-testnet-startos/startos/actions/config/autoconfig'
import { i18n } from './i18n'
import { bitcoindDescription } from './manifest/i18n'
import { sdk } from './sdk'
import { store } from './fileModels/store.json'

const bitcoind = sdk.Dependency.optional('bitcoind', {
  enabled: async ({ effects }) =>
    (await store.read((s) => s.node).const(effects)) === 'bitcoind',
  description: bitcoindDescription,
  metadata: {
    title: 'Bitcoin Core',
    icon: 'https://raw.githubusercontent.com/Start9Labs/bitcoin-core-startos/feec0b1dae42961a257948fe39b40caf8672fce1/dep-icon.svg',
  },
  versionRange:
    '(>=28.4:42 && <29) || (>=29.5:4 && <30) || (>=30.4:4 && <31) || >=31.2:4 || >=#knotsprerdts:29.3:33 || >=#roots:29.4:1',
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

const testnet = sdk.Dependency.optional('bitcoind-testnet', {
  description: bitcoindDescription,
  metadata: {
    title: 'Bitcoin Testnet4',
    icon: 'https://raw.githubusercontent.com/remcoros/bitcoind-testnet4-startos/e655655b5fde7f171f488429774ff8cc5f67ad96/dep-icon.svg',
  },
  versionRange: '>=31.2:1',
  kind: 'running',
  healthChecks: ['bitcoind', 'sync-progress'],
  enabled: async ({ effects }) =>
    (await store.read((s) => s.node).const(effects)) === 'bitcoind-testnet',
}).withInit(async (effects) => {
  await sdk.action.createTask(
    effects,
    'bitcoind-testnet',
    testnetAutoconfig,
    'critical',
    {
      input: {
        kind: 'partial',
        accept: [{ zmqEnabled: true }],
        set: { zmqEnabled: true },
      },
      reason: i18n('Must enable ZMQ in Bitcoin to use it with Public Pool'),
      when: { condition: 'input-not-matches', once: false },
    },
  )
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
  .addDependency(testnet)
  .addDependency(rbitcoin)
