import * as A from '@effect-ts/core/Collections/Immutable/Array'
import * as T from '@effect-ts/core/Effect'
import * as Ref from '@effect-ts/core/Effect/Ref'
import * as L from '@effect-ts/core/Effect/Layer'
import { flow, pipe } from '@effect-ts/core/Function'

import { TitlePersistence } from '@eirene-onboarding-3/model'
import { NotImplemented } from '@eirene-onboarding-3/core'

// TODO:
// Implement InmemoryTitlePersistence according to spec
export const InmemoryTitlePersistence = (titles: A.Array<string>) =>
  pipe(
    Ref.makeRef(titles),
    T.map(
      (ref): TitlePersistence => ({
        save: (title) => NotImplemented,
        list: NotImplemented,
      })
    ),
    L.fromEffect(TitlePersistence)
  )
