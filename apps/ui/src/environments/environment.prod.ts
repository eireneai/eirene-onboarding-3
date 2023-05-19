import * as L from '@effect-ts/core/Effect/Layer'
import { pipe } from '@effect-ts/core/Function'

import { NanoidIdGenerator } from '@eirene-onboarding-3/infra/nanoid'
import { DateTimestampGenerator } from '@eirene-onboarding-3/infra/date'
import {
  LiveRedisClient,
  RedisPubsubSubscription,
  RedisTitlePersistence,
} from '@eirene-onboarding-3/infra/redis'
import { ConsoleLogger } from '@eirene-onboarding-3/infra/console'
import {
  MongoTodoPersistence,
  LiveMongoClient,
} from '@eirene-onboarding-3/infra/mongo'

import type { Environment } from './environment'

export const environment: Environment = pipe(
  L.all(
    ConsoleLogger,
    MongoTodoPersistence({ db: 'ui', collection: 'todos' }),
    RedisPubsubSubscription('events')
  ),
  L.using(
    L.all(
      LiveRedisClient({
        host: String(process.env.REDIS_HOST),
        port: Number(process.env.REDIS_PORT),
      }),
      LiveMongoClient(
        `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`
      )
    )
  )
)
