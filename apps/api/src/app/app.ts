import * as T from '@effect-ts/core/Effect'
import * as S from '@effect-ts/schema'
import * as Express from '@effect-ts/express'
import * as exp from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { pipe } from '@effect-ts/core/Function'

import {
  TodoAdded,
  generateId,
  generateTimestamp,
  encodeTodoEvent,
  publishMessage,
  TodoRemoved,
  TodoDone,
} from '@eirene-onboarding-3/model'
import { ExpressHandler, utilsFor } from '@eirene-onboarding-3/core'

const useJSONParser = Express.use(Express.classic(exp.json()))

const useCors = Express.use(
  Express.classic(
    cors({
      optionsSuccessStatus: 200,
      origin: '*',
    })
  )
)

const useMorgan = Express.use(
  Express.classic(
    morgan(':method :url :status :response-time ms - :res[content-length]')
  )
)

const { parseT: parsePostTodoBody } = utilsFor(
  S.props({ title: S.prop(S.string) })
)

const postTodo = Express.post(
  '/todos',
  ExpressHandler((req, res) =>
    pipe(
      T.do,
      T.bind('body', () => parsePostTodoBody(req.body)),
      T.bind('id', () => generateId),
      T.bind('timestamp', () => generateTimestamp),
      T.bind('todoId', () => generateId),
      T.map(
        ({ body, id, timestamp, todoId }) =>
          new TodoAdded({
            id,
            timestamp,
            payload: {
              id: todoId,
              title: body.title,
            },
          })
      ),
      T.map(encodeTodoEvent),
      T.chain(publishMessage),
      T.catchTag('CondemnException', (err) =>
        T.succeedWith(() => {
          res.status(400).send({ message: err.message })
        })
      ),
      T.catchTag('PubsubTopicPublishFailed', () =>
        T.succeedWith(() => {
          res.status(500).send({ message: 'Internal Server Error' })
        })
      ),
      T.zipRight(
        T.succeedWith(() => {
          res.status(204).end()
        })
      )
    )
  )
)

const { parseT: parseDeleteTodoParams } = utilsFor(
  S.props({ todoId: S.prop(S.string) })
)

const deleteTodo = Express.delete(
  '/todos/:todoId',
  ExpressHandler((req, res) =>
    pipe(
      T.do,
      T.bind('params', () => parseDeleteTodoParams(req.params)),
      T.bind('id', () => generateId),
      T.bind('timestamp', () => generateTimestamp),
      T.map(
        ({ params, id, timestamp }) =>
          new TodoRemoved({
            id,
            timestamp,
            payload: {
              id: params.todoId,
            },
          })
      ),
      T.map(encodeTodoEvent),
      T.chain(publishMessage),
      T.catchTag('CondemnException', (err) =>
        T.succeedWith(() => {
          res.status(400).send({ message: err.message })
        })
      ),
      T.catchTag('PubsubTopicPublishFailed', () =>
        T.succeedWith(() => {
          res.status(500).send({ message: 'Internal Server Error' })
        })
      ),
      T.zipRight(
        T.succeedWith(() => {
          res.status(204).end()
        })
      )
    )
  )
)

const { parseT: parsePutTodoParams } = utilsFor(
  S.props({ todoId: S.prop(S.string) })
)

const putTodo = Express.put(
  '/todos/:todoId',
  ExpressHandler((req, res) =>
    pipe(
      T.do,
      T.bind('params', () => parsePutTodoParams(req.params)),
      T.bind('id', () => generateId),
      T.bind('timestamp', () => generateTimestamp),
      T.map(
        ({ params, id, timestamp }) =>
          new TodoDone({
            id,
            timestamp,
            payload: {
              id: params.todoId,
            },
          })
      ),
      T.map(encodeTodoEvent),
      T.chain(publishMessage),
      T.catchTag('CondemnException', (err) =>
        T.succeedWith(() => {
          res.status(400).send({ message: err.message })
        })
      ),
      T.catchTag('PubsubTopicPublishFailed', () =>
        T.succeedWith(() => {
          res.status(500).send({ message: 'Internal Server Error' })
        })
      ),
      T.zipRight(
        T.succeedWith(() => {
          res.status(204).end()
        })
      )
    )
  )
)

const applyMiddlewares = T.tuple(useCors, useMorgan, useJSONParser)

const addRoutes = T.tuple(postTodo, deleteTodo, putTodo)

export const app = T.tuple(applyMiddlewares, addRoutes, Express.listen)
