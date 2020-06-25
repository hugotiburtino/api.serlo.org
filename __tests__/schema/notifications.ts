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
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import {
  license,
  createLicenseQuery,
  createRemoveLicenseMutation,
  createSetLicenseMutation,
} from '../../__fixtures__/license'
import { Service } from '../../src/graphql/schema/types'
import {
  assertFailingGraphQLMutation,
  assertSuccessfulGraphQLMutation,
  assertSuccessfulGraphQLQuery,
} from '../__utils__/assertions'
import { createTestClient } from '../__utils__/test-client'
import fetch from 'node-fetch'

describe('Fail', () => {
  const server = setupServer(
    rest.post(
      `http://de.${process.env.SERLO_ORG_HOST}/api/set-notification-state/123`,
      (req, res, ctx) => {
        return res(ctx.status(403), ctx.json({}))
      }
    )
  )

  beforeAll(() => {
    // Enable the mocking before all tests
    server.listen()
  })

  afterAll(() => {
    // Clean up the mocking once done
    server.close()
  })

  test('failing set-notification-state (wrong user id)', async () => {
    const resp = await fetch(
      `http://de.${process.env.SERLO_ORG_HOST}/api/set-notification-state/123`,
      {
        method: 'POST',
        body: JSON.stringify({
          userId: 234,
        }),
      }
    )
    console.log(resp)

    // const { client } = createTestClient({ service: Service.Serlo })
    // await assertSuccessfulGraphQLMutation({
    //   ...createSetLicenseMutation(license),
    //   client,
    // })
    // await assertSuccessfulGraphQLQuery({
    //   ...createLicenseQuery(license),
    //   data: {
    //     license,
    //   },
    //   client,
    // })
  })
})
