import * as L from '@effect-ts/core/Effect/Layer'
import * as M from '@effect-ts/core/Effect/Managed'
import * as T from '@effect-ts/core/Effect'
import * as redis from 'redis'
import { pipe } from '@effect-ts/core/Function'
import { tag } from '@effect-ts/core/Has'

export interface RedisClient {
  client: redis.RedisClientType
}

export const RedisClient = tag<RedisClient>()

export interface RedisConfig {
  port: number
  host: string
}

const acquireClient = (
  config: string | RedisConfig
): redis.RedisClientType =>
  typeof config === 'string'
    ? redis.createClient({ url: config })
    : redis.createClient({
        socket: {
          port: config.port,
          host: config.host,
        },
      })

export const makeLive = (config: string | RedisConfig) =>
  pipe(
    T.succeedWith(() => acquireClient(config)),
    T.tap((client) => T.promise(() => client.connect())),
    M.make((client) => T.promise(() => client.disconnect())),
    M.map((client): RedisClient => ({ client }))
  )

export const LiveRedisClient = (config: string | RedisConfig) =>
  L.fromManaged(RedisClient)(makeLive(config))

export const accessRedisClient = T.accessService(RedisClient)
export const accessRedisClientM = T.accessServiceM(RedisClient)
