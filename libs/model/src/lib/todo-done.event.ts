import * as S from '@effect-ts/schema'

import { makeEvent, utilsFor } from '@eirene-onboarding-3/core'

export class TodoDone extends makeEvent(
  'TodoDone',
  S.props({
    id: S.prop(S.string),
  })
) {}

export const {
  parseO: parseTodoDoneO, // transform unknown JSON to within an Option<TodoDone>
  parseE: parseTodoDoneE, // transform unknown JSON to within an Either<S.CondemnException, TodoDone>
  parseT: parseTodoDone, // transform unknown JSON to within an Effect<unknown, S.CondemnException, TodoDone>
  guard: isTodoDone, // check if unknown data is already a TodoDone
  encode: encodeTodoDone, // tranform TodoDone into JSON
} = utilsFor(TodoDone)
