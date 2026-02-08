import { setupManifest } from '@start9labs/start-sdk'

export const manifest = setupManifest({
  id: 'public-pool',
  title: 'Public Pool',
  license: 'GPL',
  wrapperRepo: 'https://github.com/Start9Labs/public-pool-startos',
  upstreamRepo: 'https://github.com/benjamin-wilson/public-pool',
  supportSite: 'https://github.com/benjamin-wilson/public-pool/issues',
  docsUrl:
    'https://github.com/Start9Labs/public-pool-startos/blob/main/instructions.md',
  marketingSite: 'https://web.public-pool.io',
  donationUrl: 'https://web.public-pool.io',
  description: {
    short: {
      en_US: 'Open source Bitcoin mining pool.',
      es_ES: 'Pool de minería de Bitcoin de código abierto.',
      de_DE: 'Open-Source-Bitcoin-Mining-Pool.',
      pl_PL: 'Pula wydobywcza Bitcoin o otwartym kodzie źródłowym.',
      fr_FR: 'Pool de minage Bitcoin open source.',
    },
    long: {
      en_US: 'Open source Bitcoin mining pool.',
      es_ES: 'Pool de minería de Bitcoin de código abierto.',
      de_DE: 'Open-Source-Bitcoin-Mining-Pool.',
      pl_PL: 'Pula wydobywcza Bitcoin o otwartym kodzie źródłowym.',
      fr_FR: 'Pool de minage Bitcoin open source.',
    },
  },
  volumes: ['main'],
  images: {
    'public-pool': {
      source: {
        dockerBuild: {},
      },
      arch: ['x86_64', 'aarch64'],
      emulateMissingAs: 'aarch64',
    },
  },
  dependencies: {
    bitcoind: {
      description: 'Used to subscribe to new block events',
      optional: true,
      metadata: {
        title: 'A Bitcoin Full Node',
        icon: 'https://bitcoin.org/img/icons/opengraph.png',
      },
    },
    'bitcoind-testnet': {
      description: 'Used to subscribe to new block events',
      optional: true,
      metadata: {
        title: 'A Bitcoin Full Node',
        // @TODO replace with testnet when available
        icon: 'https://bitcoin.org/img/icons/opengraph.png',
      },
    },
  },
})
