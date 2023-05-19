import * as T from '@effect-ts/core/Effect'
import * as Ref from '@effect-ts/core/Effect/Ref'
import * as L from '@effect-ts/core/Effect/Layer'
import { pipe } from '@effect-ts/core/Function'

import { IdGenerator } from '@eirene-onboarding-3/model'

export const InmemoryIdGenerator = (start: number) =>
  pipe(
    Ref.makeRef(start),
    T.map(
      (ref): IdGenerator => ({
        generate: pipe(
          ref,
          Ref.getAndUpdate((id) => id + 1),
          T.map(String)
        ),
      })
    ),
    L.fromEffect(IdGenerator)
  )
