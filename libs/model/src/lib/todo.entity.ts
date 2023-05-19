import * as S from '@effect-ts/schema'

import { utilsFor } from '@eirene-onboarding-3/core'

export class Todo extends S.Model<Todo>()(
  S.props({
    _tag: S.prop(S.literal('Todo')),
    id: S.prop(S.string),
    title: S.prop(S.string),
    done: S.prop(S.bool),
  })
) {}

export const {
  parseO: parseTodoO, // transform unknown JSON to within an Option<Todo>
  parseE: parseTodoE, // transform unknown JSON to within an Either<S.CondemnException, Todo>
  parseT: parseTodo, // transform unknown JSON to within an Effect<unknown, S.CondemnException, Todo>
  guard: isTodo, // check if unknown data is already a Todo
  encode: encodeTodo, // tranform Todo into JSON
} = utilsFor(Todo)
