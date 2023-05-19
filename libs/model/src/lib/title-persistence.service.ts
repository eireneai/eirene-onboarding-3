import * as T from '@effect-ts/core/Effect'
import * as A from '@effect-ts/core/Collections/Immutable/Array'
import { tag } from '@effect-ts/core/Has'

export class TitlePersistenceWriteFailed {
  readonly _tag = 'TitleListPersistenceWriteFailed'
  constructor(readonly raw: unknown) {}
}

export class TitlePersistenceReadFailed {
  readonly _tag = 'TitlePersistenceReadFailed'
  constructor(readonly raw: unknown) {}
}

// declare a dependency as an interface
export interface TitlePersistence {
  save: (title: string) => T.Effect<unknown, TitlePersistenceWriteFailed, void>
  list: T.Effect<unknown, TitlePersistenceReadFailed, A.Array<string>>
}

// create a tag to refer to our dependency
export const TitlePersistence = tag<TitlePersistence>()

export const { save: saveTitle, list: listTitles } = T.deriveLifted(
  TitlePersistence
)(['save'], ['list'], [])
