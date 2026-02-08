export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Stratum server is ready': 1,
  'Stratum server is not ready': 2,
  'The web interface is ready': 3,
  'The web interface is not ready': 4,
  'Web Interface': 5,

  // interfaces.ts
  'Web UI': 100,
  'Personal web user interface for Public Pool': 101,
  'Stratum Server': 102,
  'Your Stratum server': 103,

  // actions/config.ts
  'Pool Identifier': 200,
  'The pool identifier to include in the Coinbase transactions': 201,
  'Server Display URL': 202,
  'The IP address or hostname to show on your Public Pool homepage': 203,
  'Configure': 204,
  'Customize your Public Pool instance': 205,

  // actions/setNetwork.ts
  'Switch to ${network}': 300,
  'Currently connected to ${currentNetwork}. Run action to connect to ${otherNetwork} instead': 301,
  'Are you sure you want to switch to ${network}?': 302,
  'Success': 303,
  'Successfully switched to ${network}': 304,

  // manifest/index.ts
  'Used to subscribe to new block events': 400,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
