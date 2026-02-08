import { sdk } from '../sdk'
import { envFile } from '../file-models/env'
import { mainnet, testnet } from '../utils'
import { i18n } from '../i18n'

export const setNetwork = sdk.Action.withoutInput(
  // id
  'set-network',

  // metadata
  async ({ effects }) => {
    const NETWORK = await envFile.read((e) => e.NETWORK).const(effects)
    if (!NETWORK) {
      throw new Error('No NETWORK, cannot set action metadata')
    }

    const other = NETWORK === 'mainnet' ? 'testnet' : 'mainnet'

    return {
      name: i18n('Switch to ${network}', { network: other }),
      description: i18n('Currently connected to ${currentNetwork}. Run action to connect to ${otherNetwork} instead', { currentNetwork: NETWORK, otherNetwork: other }),
      warning: i18n('Are you sure you want to switch to ${network}?', { network: other }),
      allowedStatuses: 'any',
      group: null,
      visibility: 'enabled',
    }
  },

  // the execution function
  async ({ effects }) => {
    const { NETWORK } = (await envFile.read().once())!
    const other = NETWORK === 'mainnet' ? 'testnet' : 'mainnet'

    await envFile.merge(effects, NETWORK === 'mainnet' ? testnet : mainnet)

    return {
      version: '1',
      title: i18n('Success'),
      message: i18n('Successfully switched to ${network}', { network: other }),
      result: null,
    }
  },
)
