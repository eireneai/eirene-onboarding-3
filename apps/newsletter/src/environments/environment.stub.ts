import * as L from '@effect-ts/core/Effect/Layer'

import {
  StubTitlePersistence,
  StubPubsubSubscription,
} from '@eirene-onboarding-3/infra/stub'
import { Todo, TodoAdded } from '@eirene-onboarding-3/model'
import { ConsoleLogger } from '@eirene-onboarding-3/infra/console'

import type { Environment } from './environment'

const todo = new Todo({
  id: '0',
  title: 'use effect-ts',
  done: false,
})

const events = [
  new TodoAdded({
    id: 'IMEmcoew123',
    timestamp: new Date(),
    payload: { id: '1', title: 'inject dependencies' },
  }),
]

export const environment: Environment = L.all(
  ConsoleLogger,
  StubTitlePersistence([todo.title]),
  StubPubsubSubscription(events)
)
