import * as T from '@effect-ts/core/Effect'
import { tag } from '@effect-ts/core/Has'

export interface IdGenerator {
  generate: T.Effect<unknown, never, string>
}

export const IdGenerator = tag<IdGenerator>()

export const { generate: generateId } = T.deriveLifted(
  IdGenerator
)([], ['generate'], [])
