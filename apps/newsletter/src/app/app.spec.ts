import * as T from '@effect-ts/core/Effect'
import * as EX from '@effect-ts/core/Effect/Exit'
import * as F from '@effect-ts/core/Effect/Fiber'
import * as L from '@effect-ts/core/Effect/Layer'
import { testRuntime } from '@effect-ts/jest/Runtime'

import { StubPubsubSubscription } from '@eirene-onboarding-3/infra/stub'
import { InmemoryTitlePersistence } from '@eirene-onboarding-3/infra/inmemory'

import { saveTitles } from './app'
import { TodoAdded, listTitles } from '@eirene-onboarding-3/model'
import { ConsoleLogger } from '@eirene-onboarding-3/infra/console'

describe('Newsletter App', () => {
  describe('saveTitles', () => {
    const { it } = testRuntime(
      L.all(
        ConsoleLogger,
        StubPubsubSubscription([
          new TodoAdded({
            id: '0',
            timestamp: new Date(),
            payload: {
              id: '1',
              title: 'test app',
            },
          }),
          new TodoAdded({
            id: '2',
            timestamp: new Date(),
            payload: {
              id: '3',
              title: 'learn fp',
            },
          }),
          new TodoAdded({
            id: '4',
            timestamp: new Date(),
            payload: {
              id: '5',
              title: 'inject dependencies',
            },
          }),
        ]),
        InmemoryTitlePersistence([])
      )
    )
    it('asyncronously reduces a stream of events into a materialized view', () =>
      T.gen(function* (_) {
        const handle = yield* _(T.fork(saveTitles))
        yield* _(T.delay_(F.interrupt(handle), 100))
        const result = yield* _(T.result(listTitles))
        expect(result).toEqual(
          EX.succeed(['test app', 'learn fp', 'inject dependencies'])
        )
      }))
  })
})
