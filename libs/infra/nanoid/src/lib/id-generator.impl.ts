import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import * as nanoid from 'nanoid'

import { IdGenerator } from '@eirene-onboarding-3/model'

export const NanoidIdGenerator = L.fromValue(IdGenerator)({
  generate: T.succeedWith(() => nanoid.nanoid()),
})
