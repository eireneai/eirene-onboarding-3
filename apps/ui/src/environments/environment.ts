import * as L from '@effect-ts/core/Effect/Layer'
import { pipe } from '@effect-ts/core/Function'

import { Todo } from '@eirene-onboarding-3/model'

import {
  LiveRedisClient,
  RedisPubsubSubscription,
} from '@eirene-onboarding-3/infra/redis'
import { ConsoleLogger } from '@eirene-onboarding-3/infra/console'
import { InmemoryTodoPersistence } from '@eirene-onboarding-3/infra/inmemory'

const todo = new Todo({
  id: '0',
  title: 'use effect-ts',
  done: false,
})

export type Environment = typeof environment

export const environment = pipe(
  L.all(
    ConsoleLogger,
    InmemoryTodoPersistence({ [todo.id]: todo }),
    RedisPubsubSubscription('events')
  ),
  L.using(
    LiveRedisClient({
      host: String(process.env.REDIS_HOST),
      port: Number(process.env.REDIS_PORT),
    })
  )
)
