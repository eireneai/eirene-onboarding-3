import * as L from '@effect-ts/core/Effect/Layer'
import * as S from '@effect-ts/core/Sync'
import * as T from '@effect-ts/core/Effect'
import { ObjectId } from 'bson'

import { IdGenerator } from '@eirene-onboarding-3/model'

const makeLive = S.succeedWith(
  (): IdGenerator => ({
    generate: T.succeedWith(() => new ObjectId().toString()),
  })
)

export const BSONIdGenerator = L.fromEffect(IdGenerator)(makeLive)
