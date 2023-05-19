import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import { pipe } from '@effect-ts/core/Function'

import {
  PubsubTopicPublishFailed,
  PubsubTopic,
} from '@eirene-onboarding-3/model'

import { accessRedisClient } from './client'

export const RedisPubsubTopic = (topic: string) =>
  pipe(
    accessRedisClient(
      (redis): PubsubTopic => ({
        publish: (a) =>
          T.asUnit(
            T.tryCatchPromise(
              () => {
                return redis.client.publish(topic, JSON.stringify(a))
              },
              (err) => new PubsubTopicPublishFailed(err)
            )
          ),
      })
    ),
    L.fromEffect(PubsubTopic)
  )
