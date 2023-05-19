import * as S from '@effect-ts/schema'

import { makeEvent, utilsFor } from '@eirene-onboarding-3/core'

export class TodoRemoved extends makeEvent(
  'TodoRemoved',
  S.props({
    id: S.prop(S.string),
  })
) {}

export const {
  parseO: parseTodoRemovedO, // transform unknown JSON to within an Option<TodoRemoved>
  parseE: parseTodoRemovedE, // transform unknown JSON to within an Either<S.CondemnException, TodoRemoved>
  parseT: parseTodoRemoved, // transform unknown JSON to within an Effect<unknown, S.CondemnException, TodoRemoved>
  guard: isTodoRemoved, // check if unknown data is already a TodoRemoved
  encode: encodeTodoRemoved, // tranform TodoRemoved into JSON
} = utilsFor(TodoRemoved)
