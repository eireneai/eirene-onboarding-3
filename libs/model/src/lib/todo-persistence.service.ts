import * as T from '@effect-ts/core/Effect'
import * as A from '@effect-ts/core/Collections/Immutable/Array'
import * as O from '@effect-ts/core/Option'
import { tag } from '@effect-ts/core/Has'

import { Todo } from './todo.entity.js'

export class TodoPersistenceWriteFailed {
  readonly _tag = 'TodoListPersistenceWriteFailed'
  constructor(readonly raw: unknown) {}
}

export class TodoPersistenceReadFailed {
  readonly _tag = 'TodoPersistenceReadFailed'
  constructor(readonly raw: unknown) {}
}

// declare a dependency as an interface
export interface TodoPersistence {
  save: (
    todo: Todo
  ) => T.Effect<unknown, TodoPersistenceWriteFailed, void>
  lookup: (
    todoId: string
  ) => T.Effect<unknown, TodoPersistenceReadFailed, O.Option<Todo>>
  remove: (
    todoId: string
  ) => T.Effect<unknown, TodoPersistenceWriteFailed, void>
  list: T.Effect<unknown, TodoPersistenceReadFailed, A.Array<Todo>>
}

// create a tag to refer to our dependency
export const TodoPersistence = tag<TodoPersistence>()

export const {
  save: saveTodo,
  lookup: lookupTodo,
  remove: removeTodo,
  list: listTodos,
} = T.deriveLifted(TodoPersistence)(
  ['save', 'lookup', 'remove'],
  ['list'],
  []
)
