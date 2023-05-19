import * as O from '@effect-ts/core/Option'
import * as L from '@effect-ts/core/Effect/Layer'
import * as T from '@effect-ts/core/Effect'
import * as S from '@effect-ts/schema'
import * as A from '@effect-ts/core/Collections/Immutable/Array'
import { flow, pipe } from '@effect-ts/core/Function'

import {
  TitlePersistence,
  TitlePersistenceReadFailed,
  TitlePersistenceWriteFailed,
} from '@eirene-onboarding-3/model'
import { utilsFor } from '@eirene-onboarding-3/core'

import { accessRedisClient } from './client'

const { parseO: parseTitlesO } = utilsFor(S.array(S.string))

const makeLive = (prefix: string) =>
  accessRedisClient(
    (redis): TitlePersistence => ({
      save: (title) =>
        pipe(
          T.tryPromise(() => redis.client.lPush(`${prefix}-titles`, title)),
          T.zipRight(
            T.tryPromise(() => redis.client.lTrim(`${prefix}-titles`, 0, 4))
          ),
          T.mapError((err) => new TitlePersistenceWriteFailed(err)),
          T.asUnit
        ),
      list: pipe(
        T.tryCatchPromise(
          () => redis.client.lRange(`${prefix}-titles`, 0, -1),
          (err) => new TitlePersistenceReadFailed(err)
        ),
        T.map(flow(O.fromNullable, O.chain(parseTitlesO))),
        T.someOrElse(() => A.empty<string>())
      ),
    })
  )

export const RedisTitlePersistence = flow(
  makeLive,
  L.fromEffect(TitlePersistence)
)
