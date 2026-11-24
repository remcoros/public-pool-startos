import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '#rbitcoin:0.2.5:28',
  releaseNotes: {
    en_US:
      'Select Bitcoin Testnet4 as a mining backend. rbitcoin is the default for new configurations. When using Bitcoin Core or Bitcoin Testnet4, Public Pool now reads only the RPC credential rather than the node’s data directory. Update the selected Bitcoin service first.',
    es_ES:
      'Selecciona Bitcoin Testnet4 para la minería. rbitcoin es la opción predeterminada en nuevas configuraciones. Con Bitcoin Core o Bitcoin Testnet4, Public Pool ahora solo lee la credencial RPC y no el directorio de datos. Actualiza primero el servicio Bitcoin seleccionado.',
    de_DE:
      'Wähle Bitcoin Testnet4 als Mining-Backend. Für neue Konfigurationen ist rbitcoin voreingestellt. Bei Bitcoin Core oder Bitcoin Testnet4 liest Public Pool nur noch die RPC-Zugangsdaten statt des Datenverzeichnisses. Aktualisiere zuerst den ausgewählten Bitcoin-Dienst.',
    pl_PL:
      'Wybierz Bitcoin Testnet4 jako zaplecze wydobycia. W nowych konfiguracjach domyślnie używany jest rbitcoin. Dla Bitcoin Core lub Bitcoin Testnet4 Public Pool odczytuje teraz tylko dane RPC zamiast katalogu danych. Najpierw zaktualizuj wybraną usługę Bitcoin.',
    fr_FR:
      'Choisissez Bitcoin Testnet4 pour le minage. rbitcoin est le choix par défaut pour les nouvelles configurations. Avec Bitcoin Core ou Bitcoin Testnet4, Public Pool ne lit désormais que les identifiants RPC, pas le répertoire de données. Mettez d’abord à jour le service Bitcoin choisi.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
    other: {
      '=0.2.5:26': { up: async () => {} },
      '=0.2.5:27': { up: async () => {} },
    },
  },
})
