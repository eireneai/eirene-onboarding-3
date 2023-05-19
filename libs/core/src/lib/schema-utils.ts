/* eslint-disable @typescript-eslint/no-explicit-any */
import * as T from '@effect-ts/core/Effect'
import * as E from '@effect-ts/core/Either'
import * as Encoder from '@effect-ts/schema/Encoder'
import * as Guard from '@effect-ts/schema/Guard'
import * as O from '@effect-ts/core/Option'
import * as Parser from '@effect-ts/schema/Parser'

import * as S from '@effect-ts/schema'

export interface ParseE<X, A> {
  (a: X): E.Either<S.CondemnException, A>
}

export function parseE<X, A>(
  self: Parser.Parser<X, S.AnyError, A>
): ParseE<X, A> {
  return (a: X) => {
    const res = self(a).effect
    if (res._tag === 'Left') {
      return E.left(new S.CondemnException({ message: S.drawError(res.left) }))
    }
    const warn = res.right.get(1)
    if (warn._tag === 'Some') {
      return E.left(
        new S.CondemnException({ message: S.drawError(warn.value) })
      )
    }
    return E.right(res.right.get(0))
  }
}

export interface ParseO<X, A> {
  (a: X): O.Option<A>
}

// TODO:
// Fill in the parseO function. This will accept a parser and
// return a function that takes unknown data X to an option
// of A
export function parseO<X, A>(
  self: Parser.Parser<X, S.AnyError, A>
): ParseO<X, A> {
  return (a: X) => {
    throw new Error('Not Implemented')
  }
}

export interface ParseT<X, A> {
  (a: X): T.Effect<unknown, S.CondemnException, A>
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export type Encode<X, A> = Encoder.Encoder<A, X>

export function utilsFor<
  ParserInput,
  ParserError extends S.AnyError,
  ParsedShape,
  ConstructorInput,
  ConstructorError extends S.AnyError,
  Encoded,
  Api
>(
  schema: S.Schema<
    ParserInput,
    ParserError,
    ParsedShape,
    ConstructorInput,
    ConstructorError,
    Encoded,
    Api
  >
) {
  const p = Parser.for(schema)
  return {
    parseT: S.condemnFail(p) as ParseT<ParserInput, ParsedShape>,
    parseO: parseO(p),
    parseE: parseE(p),
    guard: Guard.for(schema),
    encode: Encoder.for(schema),
  }
}

type AnySchema = S.Schema<any, S.AnyError, any, any, S.AnyError, any, any>

export type AType<Schema extends AnySchema> = Schema extends S.Schema<
  any,
  any,
  infer A,
  any,
  any,
  any,
  any
>
  ? A
  : never

export type EType<Schema extends AnySchema> = Schema extends S.Schema<
  any,
  any,
  any,
  any,
  any,
  infer E,
  any
>
  ? E
  : never
