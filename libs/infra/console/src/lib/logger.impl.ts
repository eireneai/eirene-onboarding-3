import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'

import { Logger } from '@eirene-onboarding-3/model'

export const ConsoleLogger = L.fromValue(Logger)({
  error: (s) =>
    T.succeedWith(() => {
      console.error(s)
    }),
  info: (s) =>
    T.succeedWith(() => {
      console.log(s)
    }),
  verbose: (s) =>
    T.succeedWith(() => {
      console.info(s)
    }),
  warn: (s) =>
    T.succeedWith(() => {
      console.warn(s)
    }),
})
