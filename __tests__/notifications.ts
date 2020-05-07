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
import { gql } from 'apollo-server'

import { Service } from '../src/graphql/schema/types'
import {
  assertFailingGraphQLMutation,
  assertSuccessfulGraphQLMutation,
  assertSuccessfulGraphQLQuery,
} from './__utils__/assertions'
import { createTestClient } from './__utils__/test-client'

test('_setNotifications (forbidden)', async () => {
  const { client } = createTestClient({ service: Service.Playground })
  await assertFailingGraphQLMutation(
    {
      mutation: gql`
        mutation {
          _setNotifications(user: 1, notifications: [])
        }
      `,
      client,
    },
    (errors) => {
      expect(errors[0].extensions?.code).toEqual('FORBIDDEN')
    }
  )
})

test('_setNotifications (authenticated)', async () => {
  const { client } = createTestClient({ service: Service.Serlo, user: 1 })
  await assertSuccessfulGraphQLMutation({
    mutation: gql`
      mutation {
        _setNotificationEvent(
          id: 1
          type: "type"
          payload: "payload"
          createdAt: "date"
        )
      }
    `,
    client,
  })
  await assertSuccessfulGraphQLMutation({
    mutation: gql`
      mutation {
        _setNotifications(
          user: 1
          notifications: [{ id: 1, eventId: 1, seen: false }]
        )
      }
    `,
    client,
  })
  await assertSuccessfulGraphQLQuery({
    query: gql`
      {
        notifications {
          id
        }
      }
    `,
    data: { notifications: [{ id: '1' }] },
    client,
  })
})

test('_setNotificationEvent (forbidden)', async () => {
  const { client } = createTestClient({ service: Service.Playground })
  await assertFailingGraphQLMutation(
    {
      mutation: gql`
        mutation {
          _setNotificationEvent(
            id: 1
            type: "type"
            payload: "payload"
            createdAt: "date"
          )
        }
      `,
      client,
    },
    (errors) => {
      expect(errors[0].extensions?.code).toEqual('FORBIDDEN')
    }
  )
})
