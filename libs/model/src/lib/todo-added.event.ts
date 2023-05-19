import * as S from '@effect-ts/schema'

import { makeEvent, utilsFor } from '@eirene-onboarding-3/core'


// TODO:
// Fill in the schema definition of this event's payload
// The event payload should contain an id (string) and a title (string)
export class TodoAdded extends makeEvent() {}

export const {
  parseO: parseTodoAddedO, 
  parseE: parseTodoAddedE,
  parseT: parseTodoAdded, 
  guard: isTodoAdded, 
  encode: encodeTodoAdded, 
} = utilsFor(TodoAdded)
