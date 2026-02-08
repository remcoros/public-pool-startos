import { sdk } from './sdk'
import { FileHelper, T } from '@start9labs/start-sdk'
import { bitcoindMountpoint, envDefaults, uiPort } from './utils'
import { envFile } from './file-models/env'
import { store } from './file-models/store.json'
import { i18n } from './i18n'

export const main = sdk.setupMain(async ({ effects }) => {
  /**
   * ======================== Setup (optional) ========================
   *
   * In this section, we fetch any resources or run any desired preliminary commands.
   */
  console.info('Starting Public Pool!')

  const depResult = await sdk.checkDependencies(effects)
  depResult.throwIfNotSatisfied()

  const env = (await envFile.read().const(effects))!

  // ** Stratum subcontainer **
  const stratumSub = await sdk.SubContainer.of(
    effects,
    { imageId: 'public-pool' },
    sdk.Mounts.of()
      .mountVolume({
        volumeId: 'main',
        subpath: env.NETWORK,
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
      .mountDependency({
        dependencyId:
          env.NETWORK === 'mainnet' ? 'bitcoind' : 'bitcoind-testnet',
        volumeId: 'main',
        subpath: env.NETWORK === 'mainnet' ? null : 'testnet4',
        mountpoint: bitcoindMountpoint,
        readonly: true,
      }),
    'stratum',
  )

  await FileHelper.string(`${stratumSub.rootfs}${bitcoindMountpoint}/.cookie`)
    .read()
    .const(effects)

  // ** UI subcontainer **
  const uiSub = await sdk.SubContainer.of(
    effects,
    { imageId: 'public-pool' },
    null,
    'ui',
  )
  // set desired Stratum URL for display in the UI
  const url = (await store.read().const(effects))?.stratumDisplayAddress || ''

  await uiSub.exec([
    'sh',
    '-c',
    `sed -i "s/<Stratum URL>/${url}/" "$(find /var/www/html/main.*.js)"`,
  ])

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
          sdk.healthCheck.checkPortListening(
            effects,
            Number(envDefaults.STRATUM_PORT),
            {
              successMessage: i18n('Stratum server is ready'),
              errorMessage: i18n('Stratum server is not ready'),
            },
          ),
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
