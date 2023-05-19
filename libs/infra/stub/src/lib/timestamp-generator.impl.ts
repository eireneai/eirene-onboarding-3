import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import { flow } from '@effect-ts/core/Function'

import { TimestampGenerator } from '@eirene-onboarding-3/model'

const makeLive = (timestamp: Date): TimestampGenerator => ({
  generate: T.succeed(timestamp),
})

export const StubTimestampGenerator = flow(
  makeLive,
  L.fromValue(TimestampGenerator)
)
