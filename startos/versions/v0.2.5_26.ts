import { VersionInfo } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const v_0_2_5_26 = VersionInfo.of({
  version: '0.2.5:26',
  releaseNotes: {
    en_US: 'StartOS package improvements; no change to Public Pool.',
    es_ES: 'Mejoras en el paquete de StartOS; sin cambios en Public Pool.',
    de_DE: 'Verbesserungen am StartOS-Paket; keine Änderungen an Public Pool.',
    pl_PL: 'Ulepszenia pakietu StartOS; bez zmian w Public Pool.',
    fr_FR:
      'Améliorations du paquet StartOS ; aucun changement pour Public Pool.',
  },
  migrations: {
    up: async ({ effects }) => {
      await sdk.action.clearTask(
        effects,
        'bitcoind:config',
        'bitcoind:other-config',
      )
    },
  },
})
