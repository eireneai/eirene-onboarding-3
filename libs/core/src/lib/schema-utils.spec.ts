import * as O from '@effect-ts/core/Option'
import * as E from '@effect-ts/core/Either'
import * as T from '@effect-ts/core/Effect'
import * as EX from '@effect-ts/core/Effect/Exit'
import * as S from '@effect-ts/schema'
import { testRuntime } from '@effect-ts/jest/Runtime'

import { utilsFor } from './schema-utils'

describe('Schema Utils', () => {
  const { it } = testRuntime()
  describe('utilsFor', () => {
    it('creates an encoder function from a schema', () =>
      T.succeedWith(function () {
        const { encode } = utilsFor(S.dateMs)
        const result = encode(new Date(100002030203))
        expect(result).toEqual(100002030203)
      }))
    it('creates a parseO function from a schema', () =>
      T.succeedWith(function () {
        const { parseO } = utilsFor(S.dateMs)
        expect(parseO(100002030203)).toEqual(O.some(new Date(100002030203)))
        expect(parseO('test')).toEqual(O.none)
        expect(parseO(null)).toEqual(O.none)
      }))
    it('creates a parseE function from a schema', () =>
      T.succeedWith(function () {
        const { parseE } = utilsFor(S.dateMs)
        expect(parseE(100002030203)).toEqual(E.right(new Date(100002030203)))
        expect(parseE('test')).toEqual(
          E.left(
            new S.CondemnException({
              message: `cannot process "test", expected a date in ms`,
            })
          )
        )
        expect(parseE(null)).toEqual(
          E.left(
            new S.CondemnException({
              message: `cannot process null, expected a date in ms`,
            })
          )
        )
      }))
    it('creates a parseT function from a schema', () =>
      T.gen(function* (_) {
        const { parseT } = utilsFor(S.dateMs)
        const success = yield* _(T.result(parseT(100002030203)))
        const failure = yield* _(T.result(parseT('test')))
        expect(success).toEqual(EX.succeed(new Date(100002030203)))
        expect(failure).toEqual(
          EX.fail(
            new S.CondemnException({
              message: `cannot process "test", expected a date in ms`,
            })
          )
        )
      }))
  })
})
