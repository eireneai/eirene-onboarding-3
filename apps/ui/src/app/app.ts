import * as A from '@effect-ts/core/Collections/Immutable/Array'
import * as O from '@effect-ts/core/Option'
import * as T from '@effect-ts/core/Effect'
import { flow, pipe } from '@effect-ts/core/Function'

import {
  handleMessages,
  Todo,
  saveTodo,
  logInfo,
  matchTodoEventM,
  removeTodo,
  parseTodoEvent,
  logError,
  listTodos,
  lookupTodo,
  logWarn,
} from '@eirene-onboarding-3/model'

// The web ui will periodically generate a home page
// from the database of todos

const renderListItem = (todo: Todo) => `    <li>
      <h5>${todo.title} <span>(ID: ${todo.id})</span></h5>
      <checkbox checked="${todo.done}"/>
    </li>`

const renderPage = (listItems: A.Array<string>) => `
<html>
  <h4>Todos</h4>
  <ul>
${listItems.join('\n')}
  </ul>
</html>`

const renderUI = pipe(
  listTodos,
  T.map(flow(A.map(renderListItem), renderPage)),
  T.chain(logInfo),
  T.catchTag('TodoListPersistenceWriteFailed', logError),
  T.delay(1000 * 10),
  T.forever
)

const handleTodoEvent = matchTodoEventM({
  TodoAdded: (event) =>
    saveTodo(
      new Todo({
        id: event.payload.id,
        title: event.payload.title,
        done: false,
      })
    ),
  TodoDone: (event) =>
    pipe(
      lookupTodo(event.payload.id),
      T.chain(
        O.fold(
          () => T.unit,
          (todo) =>
            saveTodo(
              new Todo({
                id: todo.id,
                title: todo.title,
                done: true,
              })
            )
        )
      )
    ),
  TodoRemoved: (event) => removeTodo(event.payload.id),
})

const updateTodos = handleMessages((message) =>
  pipe(
    message,
    parseTodoEvent,
    T.chain(handleTodoEvent),
    T.catchTag('CondemnException', () => logWarn('bad message received!')),
    T.catchTag('TodoPersistenceWriteFailed', logError),
    T.catchTag('TodoPersistenceReadFailed', logError)
  )
)

export const app = T.tuplePar(renderUI, updateTodos)
