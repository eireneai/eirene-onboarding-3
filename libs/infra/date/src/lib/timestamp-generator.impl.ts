import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'

import { TimestampGenerator } from '@eirene-onboarding-3/model'

export const DateTimestampGenerator = L.fromValue(TimestampGenerator)({
  generate: T.succeedWith(() => new Date()),
})
