import * as M from '@effect-ts/core/Effect/Managed'
import * as Q from '@effect-ts/core/Effect/Queue'
import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import { pipe } from '@effect-ts/core/Function'

import { PubsubSubscription } from '@eirene-onboarding-3/model'

import { accessRedisClient } from './client'

export const RedisPubsubSubscription = (topic: string) =>
  pipe(
    T.do,
    T.bind('client', () =>
      accessRedisClient((redis) => redis.client.duplicate())
    ),
    T.bind('queue', () => Q.makeUnbounded<unknown>()),
    T.tap(({ client }) => T.promise(() => client.connect())),
    T.tap(({ client, queue }) =>
      T.promise(async () => {
        return await client.subscribe(topic, (raw) => {
          try {
            const message = JSON.parse(raw)
            return pipe(queue, Q.offer(message), T.runPromise)
          } catch {
            return Promise.resolve()
          }
        })
      })
    ),
    M.make(({ client, queue }) =>
      T.tuple(
        T.promise(async () => {
          return await client.unsubscribe(topic)
        }),
        T.promise(() => client.disconnect()),
        Q.shutdown(queue)
      )
    ),
    M.map(
      ({ queue }): PubsubSubscription => ({
        queue,
      })
    ),
    L.fromManaged(PubsubSubscription)
  )
