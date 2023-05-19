import * as L from '@effect-ts/core/Effect/Layer'
import * as T from '@effect-ts/core/Effect'
import { ObjectId } from 'bson'

import { IdGenerator } from '@eirene-onboarding-3/model'

export const BSONIdGenerator = L.fromValue(IdGenerator)({
  generate: T.succeedWith(() => new ObjectId().toString()),
})
