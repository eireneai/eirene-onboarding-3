import * as T from '@effect-ts/core/Effect'
import { tag } from '@effect-ts/core/Has'

export interface Logger {
  error: (s: unknown) => T.UIO<void>
  info: (s: unknown) => T.UIO<void>
  verbose: (s: unknown) => T.UIO<void>
  warn: (s: unknown) => T.UIO<void>
}

export const Logger = tag<Logger>()

export const {
  error: logError,
  info: logInfo,
  verbose: logVerbose,
  warn: logWarn,
} = T.deriveLifted(Logger)(
  ['error', 'info', 'verbose', 'warn'],
  [],
  []
)
