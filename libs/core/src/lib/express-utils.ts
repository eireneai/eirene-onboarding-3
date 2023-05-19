import * as T from '@effect-ts/core/Effect'
import * as Express from '@effect-ts/express'
import type { Request, Response } from 'express'

export function ExpressHandler<R>(
  fn: (req: Request, res: Response) => T.Effect<R, never, void>
): Express.EffectRequestHandler<
  R,
  Express.ParamsDictionary,
  unknown,
  unknown,
  Express.ParsedQs,
  Record<string, unknown>
> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return fn as any
}
