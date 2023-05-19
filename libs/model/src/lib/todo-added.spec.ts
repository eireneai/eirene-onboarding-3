import * as O from '@effect-ts/core/Option'
import * as E from '@effect-ts/core/Either'
import * as T from '@effect-ts/core/Effect'
import * as EX from '@effect-ts/core/Effect/Exit'
import * as S from '@effect-ts/schema'
import { testRuntime } from '@effect-ts/jest/Runtime'

import {
  parseTodoAdded,
  parseTodoAddedO,
  parseTodoAddedE,
  encodeTodoAdded,
  TodoAdded,
} from './todo-added.event'

describe('Todo Added Event', () => {
  const { it } = testRuntime()
  describe('encodeTodoAdded', () => {
    it('encodes model to raw data', () =>
      T.succeedWith(function () {
        const result = encodeTodoAdded(
          new TodoAdded({
            timestamp: new Date(3203423001),
            id: '0',
            payload: { id: '1', title: 'test encoder' },
          })
        )
        expect(result).toEqual({
          _tag: 'TodoAdded',
          timestamp: 3203423001,
          id: '0',
          payload: { id: '1', title: 'test encoder' },
        })
      }))
  })
  describe('parseTodoAdded', () => {
    it('parses valid data effectfully', () =>
      T.gen(function* (_) {
        const result = yield* _(
          T.result(
            parseTodoAdded({
              _tag: 'TodoAdded',
              timestamp: 3203423001,
              id: '0',
              payload: { id: '1', title: 'test parser' },
            })
          )
        )
        expect(result).toEqual(
          EX.succeed(
            new TodoAdded({
              timestamp: new Date(3203423001),
              id: '0',
              payload: { id: '1', title: 'test parser' },
            })
          )
        )
      }))
    it('effectfully fails when data is invalid', () =>
      T.gen(function* (_) {
        const result = yield* _(
          T.result(
            parseTodoAdded({
              _tag: 'TodoAdded',
              id: '0',
              payload: { id: '1', title: 'test parser' },
            })
          )
        )
        expect(result).toEqual(
          EX.fail(
            new S.CondemnException({
              message: `1 error(s) found while processing Model(Anonymous)
└─ 1 error(s) found while checking keys
   └─ missing required key "timestamp"`,
            })
          )
        )
      }))
  })
  describe('parseTodoAddedO', () => {
    it('parses valid data to some', () =>
      T.succeedWith(function () {
        const result = parseTodoAddedO({
          _tag: 'TodoAdded',
          timestamp: 3203423001,
          id: '0',
          payload: { id: '1', title: 'test parser' },
        })
        expect(result).toEqual(
          O.some(
            new TodoAdded({
              timestamp: new Date(3203423001),
              id: '0',
              payload: { id: '1', title: 'test parser' },
            })
          )
        )
      }))
    it('parses invalid data to none', () =>
      T.succeedWith(function () {
        const result = parseTodoAddedO({
          _tag: 'TodoAdded',
          id: '0',
          payload: { id: '1', title: 'test parser' },
        })
        expect(result).toEqual(O.none)
      }))
  })
  describe('parseTodoAddedE', () => {
    it('parses valid data to right', () =>
      T.succeedWith(function () {
        const result = parseTodoAddedE({
          _tag: 'TodoAdded',
          timestamp: 3203423001,
          id: '0',
          payload: { id: '1', title: 'test parser' },
        })
        expect(result).toEqual(
          E.right(
            new TodoAdded({
              timestamp: new Date(3203423001),
              id: '0',
              payload: { id: '1', title: 'test parser' },
            })
          )
        )
      }))
    it('parses invalid data to right', () =>
      T.succeedWith(function () {
        const result = parseTodoAddedE({
          _tag: 'TodoAdded',
          id: '0',
          payload: { id: '1', title: 'test parser' },
        })
        expect(result).toEqual(
          E.left(
            new S.CondemnException({
              message: `1 error(s) found while processing Model(Anonymous)
└─ 1 error(s) found while checking keys
   └─ missing required key "timestamp"`,
            })
          )
        )
      }))
  })
})
