import * as A from '@effect-ts/core/Collections/Immutable/Array'
import * as O from '@effect-ts/core/Option'
import * as T from '@effect-ts/core/Effect'
import * as L from '@effect-ts/core/Effect/Layer'
import { flow, pipe } from '@effect-ts/core/Function'
import { ObjectId } from 'bson'

import {
  TodoPersistence,
  TodoPersistenceReadFailed,
  TodoPersistenceWriteFailed,
  encodeTodo,
  parseTodoO,
} from '@eirene-onboarding-3/model'
import { NotImplemented } from '@eirene-onboarding-3/core'

import { accessMongoClient } from './client'

export interface MongoTodoPeristenceConfig {
  db: string
  collection: string
}

// TODO:
// Implement MongoTodoPersistence according to spec
export const MongoTodoPersistence = (config: MongoTodoPeristenceConfig) =>
  pipe(
    accessMongoClient((mongo) =>
      mongo.client.db(config.db).collection(config.collection)
    ),
    T.map(
      (collection): TodoPersistence => ({
        save: (todo) => NotImplemented,
        remove: (todoId) => NotImplemented,
        list: NotImplemented,
        lookup: (todoId) => NotImplemented,
      })
    ),
    L.fromEffect(TodoPersistence)
  )
