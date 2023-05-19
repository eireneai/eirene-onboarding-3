import * as A from '@effect-ts/core/Collections/Immutable/Array'
import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import * as Q from '@effect-ts/core/Effect/Queue'
import * as M from '@effect-ts/core/Effect/Managed'
import { pipe } from '@effect-ts/core/Function'

import {
  PubsubSubscription,
  PubsubTopic,
  TodoEvent,
  encodeTodoEvent,
} from '@eirene-onboarding-3/model'

export const StubPubsubTopic = L.fromValue(PubsubTopic)({
  publish: () => T.unit,
})

export const StubPubsubSubscription = (events: A.Array<TodoEvent>) =>
  pipe(
    Q.makeUnbounded<unknown>(),
    T.tap(Q.offerAll(A.map_(events, encodeTodoEvent))),
    M.make(Q.shutdown),
    M.map((queue): PubsubSubscription => ({ queue })),
    L.fromManaged(PubsubSubscription)
  )
