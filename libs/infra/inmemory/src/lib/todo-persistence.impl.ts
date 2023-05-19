import * as D from '@effect-ts/core/Collections/Immutable/Dictionary'
import * as T from '@effect-ts/core/Effect'
import * as Ref from '@effect-ts/core/Effect/Ref'
import * as L from '@effect-ts/core/Effect/Layer'
import { pipe } from '@effect-ts/core/Function'

import { Todo, TodoPersistence } from '@eirene-onboarding-3/model'

export const InmemoryTodoPersistence = (todos: D.Dictionary<Todo>) =>
  pipe(
    Ref.makeRef(todos),
    T.map(
      (ref): TodoPersistence => ({
        save: (todo) => pipe(ref, Ref.update(D.insertAt(todo.id, todo))),
        list: pipe(ref, Ref.get, T.map(D.values)),
        remove: (todoId) => pipe(ref, Ref.update(D.deleteAt(todoId))),
        lookup: (todoId) => pipe(ref, Ref.get, T.map(D.lookup(todoId))),
      })
    ),
    L.fromEffect(TodoPersistence)
  )
