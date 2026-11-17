import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '#rbitcoin:0.2.5:27',
  releaseNotes: {
    en_US:
      'Choose Bitcoin Core or rbitcoin in Configure. Public Pool reads the selected node’s RPC cookie automatically. Requires StartOS 0.4.2 or later.',
    es_ES:
      'Elige Bitcoin Core o rbitcoin en Configurar. Public Pool lee automáticamente la cookie RPC del nodo seleccionado. Requiere StartOS 0.4.2 o posterior.',
    de_DE:
      'Wähle Bitcoin Core oder rbitcoin unter Konfigurieren. Public Pool liest das RPC-Cookie des ausgewählten Knotens automatisch. Erfordert StartOS 0.4.2 oder neuer.',
    pl_PL:
      'Wybierz Bitcoin Core lub rbitcoin w konfiguracji. Public Pool automatycznie odczytuje plik cookie RPC wybranego węzła. Wymaga StartOS 0.4.2 lub nowszego.',
    fr_FR:
      'Choisissez Bitcoin Core ou rbitcoin dans Configurer. Public Pool lit automatiquement le cookie RPC du nœud sélectionné. Nécessite StartOS 0.4.2 ou ultérieur.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
    other: {
      '=0.2.5:26': {
        up: async () => {},
      },
    },
  },
})
