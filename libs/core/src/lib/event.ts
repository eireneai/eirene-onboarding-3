import * as S from '@effect-ts/schema'

export interface Event<T extends string, P> {
  readonly _tag: T
  readonly id: string
  readonly timestamp: Date
  readonly payload: P
  readonly copy: (args: Partial<Omit<this, 'copy'>>) => this
}

export type AnyEvent = Event<string, unknown>

export function makeEvent<
  T extends string,
  ParserError extends S.AnyError,
  ParsedShape,
  ConstructorInput,
  ConstructorError extends S.AnyError,
  Encoded,
  Api
>(
  tag: T,
  payload: S.Schema<
    unknown,
    ParserError,
    ParsedShape,
    ConstructorInput,
    ConstructorError,
    Encoded,
    Api
  >
) {
  return S.Model<Event<T, ParsedShape>>()(
    S.props({
      _tag: S.prop(S.literal(tag)),
      id: S.prop(S.string),
      timestamp: S.prop(S.dateMs),
      payload: S.prop(payload),
    })
  )
}
