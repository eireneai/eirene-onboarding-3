import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import { flow } from '@effect-ts/core/Function'

import { IdGenerator } from '@eirene-onboarding-3/model'

const makeLive = (id: string): IdGenerator => ({
  generate: T.succeed(id),
})

export const StubIdGenerator = flow(
  makeLive,
  L.fromValue(IdGenerator)
)
