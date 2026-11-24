import { sdk } from './sdk'
import { FileHelper, T } from '@start9labs/start-sdk'
import { readdir, readFile, writeFile } from 'fs/promises'
import { rpcVolumeId as bitcoinRpcVolumeId } from 'bitcoin-core-startos/startos/utils'
import { rpcVolumeId as testnetRpcVolumeId } from 'bitcoin-core-testnet-startos/startos/utils'
import {
  bitcoindMountpoint,
  getBitcoindBridge,
  getTestnetBridge,
  stratumPort,
  uiPort,
} from './utils'
import { envFile } from './fileModels/env'
import { store } from './fileModels/store.json'
import { i18n } from './i18n'
import { dependencies } from './dependencies'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info('Starting Public Pool!')

  const depResult = await dependencies.check(effects)
  depResult.throwIfNotSatisfied()

  const node = (await store.read((s) => s.node).const(effects)) ?? 'rbitcoin'
  const bitcoin =
    node === 'bitcoind'
      ? await getBitcoindBridge(effects)
      : node === 'bitcoind-testnet'
        ? await getTestnetBridge(effects)
        : null
  const rbitcoin =
    node === 'rbitcoin'
      ? await sdk.host
          .getBridgeAddress(effects, {
            packageId: 'rbitcoin',
            hostId: 'rpc',
            internalPort: 8332,
            ssl: false,
          })
          .const()
      : null
  if ((node !== 'rbitcoin' && !bitcoin) || (node === 'rbitcoin' && !rbitcoin))
    throw new Error(
      i18n(
        'Bitcoin is not yet reachable on the internal network. Ensure it is installed and running.',
      ),
    )
  const [rpcHost, rpcPort] =
    node !== 'rbitcoin'
      ? [bitcoin!.rpcHost, bitcoin!.rpcPort]
      : rbitcoin!.split(':')
  const cookiePath =
    node === 'rbitcoin'
      ? '/mnt/bitcoind/datadir/rpc.cookie'
      : '/mnt/bitcoind/.cookie'
  await envFile.merge(
    effects,
    {
      NETWORK: node === 'bitcoind-testnet' ? 'testnet' : 'mainnet',
      BITCOIN_RPC_URL: `http://${rpcHost}`,
      BITCOIN_RPC_PORT: rpcPort,
      BITCOIN_RPC_COOKIEFILE: cookiePath,
      BITCOIN_ZMQ_HOST: bitcoin
        ? `tcp://${bitcoin.zmqHost}:${bitcoin.zmqPort}`
        : '',
    },
    { allowWriteAfterConst: true },
  )

  // ** Stratum subcontainer **
  const stratumSub = sdk.SubContainer.of(
    effects,
    { imageId: 'public-pool' },
    sdk.Mounts.of()
      .mountVolume({
        volumeId: 'main',
        subpath: node === 'bitcoind-testnet' ? 'testnet4' : 'mainnet',
        mountpoint: '/public-pool/DB',
        readonly: false,
      })
      .mountVolume({
        volumeId: 'main',
        subpath: '.env',
        mountpoint: '/public-pool/.env',
        readonly: true,
        type: 'file',
      })
      .mountDependency<T.SDKManifest>({
        dependencyId: node,
        volumeId:
          node === 'rbitcoin'
            ? 'main'
            : node === 'bitcoind'
              ? bitcoinRpcVolumeId
              : testnetRpcVolumeId,
        subpath: null,
        mountpoint: bitcoindMountpoint,
        readonly: true,
      }),
    'stratum',
  )

  await FileHelper.string(`${await stratumSub.rootfs}${cookiePath}`)
    .read()
    .const(effects)

  // ** UI subcontainer **
  const uiSub = sdk.SubContainer.of(
    effects,
    { imageId: 'public-pool' },
    null,
    'ui',
  )
  // set desired Stratum URL for display in the UI (baked-in placeholder, see environment.prod.ts)
  const url = (await store.read().const(effects))?.stratumDisplayAddress || ''

  // Substituted in Node rather than through `sh -c sed`: the address is
  // user-supplied, and both layers would read it as syntax — a lone '/' ends
  // sed's s/// early, and a quote or $( ) escapes the shell entirely.
  const htmlDir = await uiSub.subpath('/var/www/html')
  const bundle = (await readdir(htmlDir)).find((f) => /^main\..*\.js$/.test(f))
  if (bundle) {
    const bundlePath = `${htmlDir}/${bundle}`
    const contents = await readFile(bundlePath, 'utf8')
    await writeFile(bundlePath, contents.split('<Stratum URL>').join(url))
  }

  /**
   * ======================== Daemons ========================
   *
   * In this section, we create one or more daemons that define the service runtime.
   *
   * Each daemon defines its own health check, which can optionally be exposed to the user.
   */
  return sdk.Daemons.of(effects)
    .addDaemon('stratum', {
      subcontainer: stratumSub,
      exec: {
        command: ['/usr/local/bin/node', 'dist/main.js'],
        cwd: '/public-pool',
      },
      ready: {
        display: i18n('Stratum Server'),
        gracePeriod: 15_000,
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, stratumPort, {
            successMessage: i18n('Stratum server is ready'),
            errorMessage: i18n('Stratum server is not ready'),
          }),
      },
      requires: [],
    })
    .addDaemon('ui', {
      subcontainer: uiSub,
      exec: {
        command: ['nginx', '-g', 'daemon off;'],
      },
      ready: {
        display: i18n('Web Interface'),
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, uiPort, {
            successMessage: i18n('The web interface is ready'),
            errorMessage: i18n('The web interface is not ready'),
          }),
      },
      requires: [],
    })
})
