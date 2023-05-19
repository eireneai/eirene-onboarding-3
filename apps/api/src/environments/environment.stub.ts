import * as L from '@effect-ts/core/Effect/Layer'
import * as Express from '@effect-ts/express'

import {
  StubIdGenerator,
  StubTimestampGenerator,
  StubPubsubTopic,
} from '@eirene-onboarding-3/infra/stub'
import { ConsoleLogger } from '@eirene-onboarding-3/infra/console'

import type { Environment } from './environment'

export const environment: Environment = L.all(
  ConsoleLogger,
  StubIdGenerator('0'),
  StubTimestampGenerator(new Date()),
  StubPubsubTopic,
  Express.LiveExpress('localhost', 8080)
)
