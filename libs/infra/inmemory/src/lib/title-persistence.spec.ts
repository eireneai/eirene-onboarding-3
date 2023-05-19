import * as T from '@effect-ts/core/Effect'
import * as EX from '@effect-ts/core/Effect/Exit'
import { testRuntime } from '@effect-ts/jest/Runtime'

import { saveTitle, listTitles } from '@eirene-onboarding-3/model'

import { InmemoryTitlePersistence } from './title-persistence.impl'

describe('Inmemory Title Persistence', () => {
  describe('saveTitle', () => {
    const { it } = testRuntime(InmemoryTitlePersistence([]))
    it('saves a title', () =>
      T.gen(function* (_) {
        const result = yield* _(T.result(saveTitle('learn fp')))
        expect(result).toEqual(EX.unit)
      }))
  })
  describe('listTitles', () => {
    const { it } = testRuntime(
      InmemoryTitlePersistence(['first', 'second', 'third', 'fourth', 'fifth'])
    )
    it('lists existing titles', () =>
      T.gen(function* (_) {
        const result = yield* _(T.result(listTitles))
        expect(result).toEqual(
          EX.succeed(['first', 'second', 'third', 'fourth', 'fifth'])
        )
      }))
    it('only lists five titles after adding a sixth', () =>
      T.gen(function* (_) {
        yield* _(saveTitle('sixth'))
        const result = yield* _(T.result(listTitles))
        expect(result).toEqual(
          EX.succeed(['second', 'third', 'fourth', 'fifth', 'sixth'])
        )
      }))
  })
})
