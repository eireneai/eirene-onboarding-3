import * as L from '@effect-ts/core/Effect/Layer'
import * as Express from '@effect-ts/express'
import { pipe } from '@effect-ts/core/Function'

import {
  LiveRedisClient,
  RedisPubsubTopic,
} from '@eirene-onboarding-3/infra/redis'
import { BSONIdGenerator } from '@eirene-onboarding-3/infra/bson'
import { DateTimestampGenerator } from '@eirene-onboarding-3/infra/date'
import { ConsoleLogger } from '@eirene-onboarding-3/infra/console'

import type { Environment } from './environment'

export const environment: Environment = pipe(
  L.all(
    ConsoleLogger,
    BSONIdGenerator,
    DateTimestampGenerator,
    RedisPubsubTopic('events'),
    Express.LiveExpress(
      String(process.env.EXPRESS_HOST),
      Number(process.env.EXPRESS_PORT)
    )
  ),
  L.using(
    LiveRedisClient({
      host: String(process.env.REDIS_HOST),
      port: Number(process.env.REDIS_PORT),
    })
  )
)
