import * as L from '@effect-ts/core/Effect/Layer'
import * as M from '@effect-ts/core/Effect/Managed'
import * as T from '@effect-ts/core/Effect'
import * as mongo from 'mongodb'
import { flow, pipe } from '@effect-ts/core/Function'
import { tag } from '@effect-ts/core/Has'

export interface MongoClient {
  client: mongo.MongoClient
}

export const MongoClient = tag<MongoClient>()

export interface MongoConfig {
  port: number
  host: string
}

const makeLive = (uri: string) =>
  pipe(
    T.promise(() =>
      new mongo.MongoClient(uri, {
        serverApi: mongo.ServerApiVersion.v1,
      }).connect()
    ),
    M.make((client) => T.promise(() => client.close())),
    M.map((client): MongoClient => ({ client }))
  )

export const LiveMongoClient = flow(makeLive, L.fromManaged(MongoClient))

export const accessMongoClient = T.accessService(MongoClient)
export const accessMongoClientM = T.accessServiceM(MongoClient)
