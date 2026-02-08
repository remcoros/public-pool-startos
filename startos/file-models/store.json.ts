import { matches, FileHelper } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
const { object, string } = matches

const shape = object({
  stratumDisplayAddress: string.nullable().onMismatch(null),
})

export const store = FileHelper.json(
  {
    base: sdk.volumes.main,
    subpath: '/store.json',
  },
  shape,
)
