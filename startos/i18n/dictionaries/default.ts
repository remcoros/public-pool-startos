export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Stratum server is ready': 1,
  'Stratum server is not ready': 2,
  'The web interface is ready': 3,
  'The web interface is not ready': 4,
  'Web Interface': 5,
  'Bitcoin is not yet reachable on the internal network. Ensure it is installed and running.': 6,

  // interfaces.ts
  'Web UI': 100,
  'Personal web user interface for Public Pool': 101,
  'Stratum Server': 102,
  'Where your miners connect': 103,

  'Changing networks restarts the pool. Configure miners with an address for the selected network.': 210,
  'Bitcoin node': 208,
  'Choose the node that supplies mining templates.': 209,

  // actions/config.ts
  'Pool Identifier': 200,
  'Written into the coinbase transaction of every block this pool builds, so it becomes public on the blockchain if one of your miners finds a block. If it is too long to fit, the pool leaves it out.': 201,
  'Server Display URL': 202,
  'The plain stratum address the Public Pool homepage tells miners to connect to. It changes what the homepage shows, not where the pool listens. Choose a LAN IP address if your miners cannot resolve .local names.': 203,
  Configure: 204,
  'Set the pool identifier and the stratum addresses the homepage shows to miners.': 205,
  'Secure Server Display URL': 206,
  'The stratum+tls address to show to miners that connect over TLS. The web interface this package ships does not display it yet.': 207,

  // dependencies.ts
  'Must enable ZMQ in Bitcoin to use it with Public Pool': 300,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
