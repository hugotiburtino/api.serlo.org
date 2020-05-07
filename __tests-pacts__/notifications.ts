import { gql } from 'apollo-server'

import { notificationEvent, notifications } from '../__fixtures__/notifications'
import { createTestClient } from '../__tests__/__utils__/test-client'
import { Service } from '../src/graphql/schema/types'
import { assertSuccessfulGraphQLQuery } from './__utils__/assertions'
import {
  addNotificationEventInteraction,
  addNotificationsInteraction,
} from './__utils__/interactions'

test('Notifications', async () => {
  global.client = createTestClient({
    service: Service.Playground,
    user: 1,
  }).client
  await addNotificationEventInteraction(notificationEvent)
  await addNotificationsInteraction(notifications)
  await assertSuccessfulGraphQLQuery({
    query: gql`
      {
        notifications {
          id
          type
          payload
          createdAt
          seen
        }
      }
    `,
    data: {
      notifications: [
        {
          id: `${notifications.notifications[0].id}`,
          type: notificationEvent.type,
          payload: notificationEvent.payload,
          createdAt: notificationEvent.createdAt,
          seen: notifications.notifications[0].seen,
        },
      ],
    },
  })
})
