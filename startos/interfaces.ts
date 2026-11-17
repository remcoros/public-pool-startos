import { sdk } from './sdk'
import { i18n } from './i18n'
import { uiPort, stratumPort } from './utils'

// Host id (the sdk.MultiHost.of group) — distinct from the interface ids
// exported on it. Used for sdk.host.getOwn lookups.
export const mainHostId = 'main'
export const uiInterfaceId = 'ui'
export const stratumInterfaceId = 'stratum'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  // Use a single MultiHost for both UI and Stratum, so they can share the same (sub)domain
  const multiHost = sdk.MultiHost.of(effects, mainHostId)

  // UI
  const uiMultiOrigin = await multiHost.bindPort(uiPort, {
    protocol: 'http',
  })
  const ui = sdk.createInterface(effects, {
    name: i18n('Web UI'),
    id: uiInterfaceId,
    description: i18n('Personal web user interface for Public Pool'),
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })
  const uiReceipt = await uiMultiOrigin.export([ui])

  // Stratum — plain TCP on 3333, with StartOS-terminated TLS on 4333.
  // secure: { ssl: false } keeps the plain port exposed on regular (non-"secure")
  // LAN gateways; with secure: null the OS would expose only the TLS port there.
  const stratumMultiOrigin = await multiHost.bindPort(stratumPort, {
    protocol: null,
    addSsl: { preferredExternalPort: 4333, alpn: null },
    preferredExternalPort: stratumPort,
    secure: { ssl: false },
    proxy: null,
  })
  const stratum = sdk.createInterface(effects, {
    name: i18n('Stratum Server'),
    id: stratumInterfaceId,
    description: i18n('Where your miners connect'),
    type: 'api',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })
  const stratumReceipt = await stratumMultiOrigin.export([stratum])

  return [uiReceipt, stratumReceipt]
})
