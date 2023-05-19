import * as A from '@effect-ts/core/Collections/Immutable/Array'
import * as ST from '@effect-ts/core/String'
import * as T from '@effect-ts/core/Effect'
import { flow, pipe } from '@effect-ts/core/Function'

import {
  handleMessages,
  listTitles,
  logInfo,
  logWarn,
  parseTodoEvent,
  matchTodoEventM,
  saveTitle,
  logError,
} from '@eirene-onboarding-3/model'
import { NotImplemented } from '@eirene-onboarding-3/core'

const renderBody = flow(
  A.mapWithIndex((i, title: string) => `${i + 1}) ${title}`),
  A.prepend('Here are some of the latest todos added to the platform:'),
  A.prepend('Dear User,'),
  ST.unlines
)

const sendNewsletter = pipe(
  listTitles,
  T.map(renderBody),
  T.chain(logInfo),
  T.delay(1000 * 15),
  T.forever
)

// TODO:
// complete the handleTodoEvent function - it is very similar
// to the reducer function from the first project

const handleTodoEvent = matchTodoEventM({
  TodoAdded: (event) => saveTitle(event.payload.title),
  TodoDone: () => T.unit,
  TodoRemoved: () => T.unit,
})

export const saveTitles = handleMessages((message) => NotImplemented)

export const app = T.tuplePar(sendNewsletter, saveTitles)
