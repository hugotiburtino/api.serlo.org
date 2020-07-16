/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { none, some } from 'fp-ts/lib/Option'

import { Cache } from '../graphql/environment'

export function createInMemoryCache(): Cache & { reset(): void } {
  let cache: Record<string, string> = {}

  return {
    // eslint-disable-next-line @typescript-eslint/require-await
    async get(key) {
      const serialized = cache[key]
      return serialized === undefined ? none : some(JSON.parse(serialized))
    },
    // eslint-disable-next-line @typescript-eslint/require-await
    async set(key, value) {
      cache[key] = JSON.stringify(value)
    },
    reset() {
      cache = {}
    },
  }
}
