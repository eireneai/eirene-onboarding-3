import * as A from '@effect-ts/core/Collections/Immutable/Array'
import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import { flow } from '@effect-ts/core/Function'

import { TitlePersistence } from '@eirene-onboarding-3/model'

const makeLive = (titles: A.Array<string>): TitlePersistence => ({
  save: () => T.unit,
  list: T.succeed(titles),
})

export const StubTitlePersistence = flow(
  makeLive,
  L.fromValue(TitlePersistence)
)
