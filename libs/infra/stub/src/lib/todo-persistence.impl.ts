import * as A from '@effect-ts/core/Collections/Immutable/Array'
import * as T from '@effect-ts/core/Effect'
import * as O from '@effect-ts/core/Option'
import * as L from '@effect-ts/core/Effect/Layer'
import { flow } from '@effect-ts/core/Function'

import { Todo, TodoPersistence } from '@eirene-onboarding-3/model'

const makeLive = (todos: A.Array<Todo>): TodoPersistence => ({
  lookup: () => T.succeed(O.none),
  save: () => T.unit,
  remove: () => T.unit,
  list: T.succeed(todos),
})

export const StubTodoPersistence = flow(makeLive, L.fromValue(TodoPersistence))
