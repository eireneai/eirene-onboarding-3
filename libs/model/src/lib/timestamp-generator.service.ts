import * as T from '@effect-ts/core/Effect'
import { tag } from '@effect-ts/core/Has'

export interface TimestampGenerator {
  generate: T.Effect<unknown, never, Date>
}

export const TimestampGenerator = tag<TimestampGenerator>()

export const { generate: generateTimestamp } = T.deriveLifted(
  TimestampGenerator
)([], ['generate'], [])
