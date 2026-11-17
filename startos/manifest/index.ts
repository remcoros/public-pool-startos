import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'public-pool',
  title: 'Public Pool',
  license: 'GPL',
  packageRepo: 'https://github.com/remcoros/public-pool-startos',
  upstreamRepo: 'https://github.com/benjamin-wilson/public-pool',
  marketingUrl: 'https://web.public-pool.io',
  donationUrl: 'https://web.public-pool.io',
  description: { short, long },
  volumes: ['main'],
  images: {
    'public-pool': {
      source: {
        dockerBuild: {},
      },
      arch: ['x86_64', 'aarch64'],
      emulateMissing: false,
    },
  },
})
