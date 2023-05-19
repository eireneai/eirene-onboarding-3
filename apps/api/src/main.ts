import * as T from '@effect-ts/core/Effect'
import { pipe } from '@effect-ts/core/Function'
import { runMain } from '@effect-ts/node/Runtime'

import { environment } from './environments/environment'
import { app } from './app/app'

pipe(app, T.provide(T.defaultEnv), T.provideLayer(environment), runMain)
