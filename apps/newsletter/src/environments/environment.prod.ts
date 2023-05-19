import * as L from '@effect-ts/core/Effect/Layer'
import * as Express from '@effect-ts/express'
import { pipe } from '@effect-ts/core/Function'

import {
  LiveRedisClient,
  RedisTitlePersistence,
  RedisPubsubSubscription,
} from '@eirene-onboarding-3/infra/redis'
import { ConsoleLogger } from '@eirene-onboarding-3/infra/console'
import { DateTimestampGenerator } from '@eirene-onboarding-3/infra/date'

import type { Environment } from './environment'

export const environment: Environment = pipe(
  L.all(
    ConsoleLogger,
    DateTimestampGenerator,
    RedisTitlePersistence('ui'),
    RedisPubsubSubscription('events'),
  ),
  L.using(
    LiveRedisClient({
      host: String(process.env.REDIS_HOST),
      port: Number(process.env.REDIS_PORT),
    })
  )
)
