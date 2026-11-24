import { sdk } from '../sdk'
import { envFile } from '../fileModels/env'
import { utils } from '@start9labs/start-sdk'
import { store } from '../fileModels/store.json'
import { mainHostId, stratumInterfaceId } from '../interfaces'
import { i18n } from '../i18n'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  node: Value.select({
    name: i18n('Bitcoin node'),
    description: i18n('Choose the node that supplies mining templates.'),
    warning: i18n(
      'Changing networks restarts the pool. Configure miners with an address for the selected network.',
    ),
    values: {
      bitcoind: 'Bitcoin Core',
      rbitcoin: 'rbitcoin',
      'bitcoind-testnet': 'Bitcoin Testnet4',
    },
    default: 'rbitcoin',
  }),
  POOL_IDENTIFIER: Value.text({
    name: i18n('Pool Identifier'),
    description: i18n(
      'Written into the coinbase transaction of every block this pool builds, so it becomes public on the blockchain if one of your miners finds a block. If it is too long to fit, the pool leaves it out.',
    ),
    required: true,
    default: 'Public-Pool on StartOS',
    placeholder: 'Public-Pool on StartOS',
    maxLength: 100,
    patterns: [utils.Patterns.ascii],
  }),
  poolDisplayUrl: Value.dynamicSelect(async ({ effects }) => {
    const urls = await sdk.host
      .getOwn(effects, mainHostId, (host) => {
        const iface =
          host &&
          Object.values(host.bindings)
            .flatMap((b) => Object.values(b.interfaces))
            .find((i) => i.id === stratumInterfaceId)
        const addrs = iface?.addressInfo?.filter({
          kind: ['domain', 'ipv4', 'mdns'],
          exclude: { kind: ['localhost', 'link-local', 'bridge'] },
          predicate: (h) => !h.ssl,
        })
        // .local first so it lands as the default
        return [
          ...(addrs?.filter({ kind: 'mdns' })?.format() || []),
          ...(addrs?.filter({ exclude: { kind: 'mdns' } })?.format() || []),
        ]
      })
      .const()

    return {
      name: i18n('Server Display URL'),
      description: i18n(
        'The plain stratum address the Public Pool homepage tells miners to connect to. It changes what the homepage shows, not where the pool listens. Choose a LAN IP address if your miners cannot resolve .local names.',
      ),
      values: urls.reduce(
        (obj, url) => ({
          ...obj,
          [url]: url,
        }),
        {} as Record<string, string>,
      ),
      default: urls[0] ?? null,
    }
  }),
  securePoolDisplayUrl: Value.dynamicSelect(async ({ effects }) => {
    const urls = await sdk.host
      .getOwn(effects, mainHostId, (host) => {
        const iface =
          host &&
          Object.values(host.bindings)
            .flatMap((b) => Object.values(b.interfaces))
            .find((i) => i.id === stratumInterfaceId)
        const addrs = iface?.addressInfo?.filter({
          kind: ['domain', 'ipv4', 'mdns'],
          exclude: { kind: ['localhost', 'link-local', 'bridge'] },
          predicate: (h) => h.ssl,
        })
        // .local first so it lands as the default (the TLS cert matches the hostname)
        return [
          ...(addrs?.filter({ kind: 'mdns' })?.format() || []),
          ...(addrs?.filter({ exclude: { kind: 'mdns' } })?.format() || []),
        ]
      })
      .const()

    return {
      name: i18n('Secure Server Display URL'),
      description: i18n(
        'The stratum+tls address to show to miners that connect over TLS. The web interface this package ships does not display it yet.',
      ),
      values: urls.reduce(
        (obj, url) => ({
          ...obj,
          [url]: url,
        }),
        {} as Record<string, string>,
      ),
      default: urls[0] ?? null,
    }
  }),
})

export const config = sdk.Action.withInput(
  // id
  'config',

  // metadata
  async ({ effects }) => ({
    name: i18n('Configure'),
    description: i18n(
      'Set the pool identifier and the stratum addresses the homepage shows to miners.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async ({ effects }) => ({
    node: (await store.read().once())?.node ?? 'rbitcoin',
    POOL_IDENTIFIER: (await envFile.read().once())?.POOL_IDENTIFIER,
    poolDisplayUrl:
      (await store.read((s) => s.stratumDisplayAddress).once()) || undefined,
    securePoolDisplayUrl:
      (await store.read((s) => s.secureStratumDisplayAddress).once()) ||
      undefined,
  }),

  // the execution function
  async ({ effects, input }) => {
    await Promise.all([
      envFile.merge(effects, {
        POOL_IDENTIFIER: input.POOL_IDENTIFIER,
      }),
      store.merge(effects, {
        node: input.node,
        stratumDisplayAddress: input.poolDisplayUrl,
        secureStratumDisplayAddress: input.securePoolDisplayUrl,
      }),
    ])
  },
)
