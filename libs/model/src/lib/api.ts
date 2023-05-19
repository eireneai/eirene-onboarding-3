import * as T from '@effect-ts/core/Effect'
import * as S from '@effect-ts/schema'

import { utilsFor } from '@eirene-onboarding-3/core'

import { TodoAdded } from './todo-added.event'
import { TodoDone } from './todo-done.event'
import { TodoRemoved } from './todo-removed.event'

export const TodoEvent = S.union({
  TodoAdded,
  TodoDone,
  TodoRemoved,
})

export type TodoEvent = TodoAdded | TodoDone | TodoRemoved

export const matchTodoEventM = T.matchTagIn<TodoEvent>()

export const {
  parseO: parseTodoEventO,
  parseE: parseTodoEventE,
  parseT: parseTodoEvent,
  guard: isTodoEvent,
  encode: encodeTodoEvent,
} = utilsFor(TodoEvent)
