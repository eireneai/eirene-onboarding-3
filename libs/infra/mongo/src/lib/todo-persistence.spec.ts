import * as O from '@effect-ts/core/Option'
import * as E from '@effect-ts/core/Either'
import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import * as EX from '@effect-ts/core/Effect/Exit'
import * as S from '@effect-ts/schema'
import { testRuntime } from '@effect-ts/jest/Runtime'
import { pipe } from '@effect-ts/core/Function'

import {
  saveTodo,
  listTodos,
  removeTodo,
  lookupTodo,
  Todo,
} from '@eirene-onboarding-3/model'

import { MongoTodoPersistence } from './todo-persistence.impl'
import { LiveMongoClient } from './client'

const safeDescribe =
  !!process.env.MONGO_HOST && !!process.env.MONGO_PORT
    ? describe
    : describe.skip

safeDescribe('Mongo Todo Persistence', () => {
  const { it } = testRuntime(
    pipe(
      MongoTodoPersistence({ db: 'test', collection: 'todos' }),
      L.using(
        LiveMongoClient(
          `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`
        )
      )
    )
  )
  describe('saveTodo', () => {
    it('saves a Todo', () =>
      T.gen(function* (_) {
        const result = yield* _(
          T.result(
            saveTodo(
              new Todo({
                id: '6466d274ee821f6d6f973ae9',
                title: 'learn fp',
                done: false,
              })
            )
          )
        )
        expect(result).toEqual(EX.unit)
      }))
  })
  describe('listTodos', () => {
    it('retreives saved Todo', () =>
      T.gen(function* (_) {
        const result = yield* _(T.result(listTodos))
        expect(result).toEqual(
          EX.succeed([
            new Todo({
              id: '6466d274ee821f6d6f973ae9',
              title: 'learn fp',
              done: false,
            }),
          ])
        )
      }))
  })
  describe('lookupTodo', () => {
    it('looks up saved Todo', () =>
      T.gen(function* (_) {
        const result = yield* _(
          T.result(lookupTodo('6466d274ee821f6d6f973ae9'))
        )
        expect(result).toEqual(
          EX.succeed(
            O.some(
              new Todo({
                id: '6466d274ee821f6d6f973ae9',
                title: 'learn fp',
                done: false,
              })
            )
          )
        )
      }))
    it('returns none if Todo does not exist', () =>
      T.gen(function* (_) {
        const result = yield* _(
          T.result(lookupTodo('6466d274ee821f6d6f973ae0'))
        )
        expect(result).toEqual(EX.succeed(O.none))
      }))
  })
  describe('removeTodo', () => {
    it('removes saved todo', () =>
      T.gen(function* (_) {
        const result = yield* _(
          T.result(removeTodo('6466d274ee821f6d6f973ae9'))
        )
        expect(result).toEqual(EX.unit)
      }))
  })
})
