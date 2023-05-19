import * as T from '@effect-ts/core/Effect'
import * as Q from '@effect-ts/core/Effect/Queue'
import { Has, tag } from '@effect-ts/core/Has'
import { pipe } from '@effect-ts/core/Function'

export interface PubsubSubscription {
  queue: Q.Queue<unknown>
}

export const PubsubSubscription = tag<PubsubSubscription>()

export function handleMessages<R, E>(
  fn: (a: unknown) => T.Effect<R, E, void>
): T.Effect<R & Has<PubsubSubscription>, E, never> {
  return T.accessServiceM(PubsubSubscription)(({ queue }) =>
    pipe(queue, Q.take, T.chain(fn), T.forever)
  )
}

export class PubsubTopicPublishFailed {
  readonly _tag = 'PubsubTopicPublishFailed'
  constructor(readonly raw: unknown) {}
}

export interface PubsubTopic {
  publish: (
    a: unknown
  ) => T.Effect<unknown, PubsubTopicPublishFailed, void>
}

export const PubsubTopic = tag<PubsubTopic>()

export const { publish: publishMessage } = T.deriveLifted(
  PubsubTopic
)(['publish'], [], [])
