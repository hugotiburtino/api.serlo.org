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
import { gql, AuthenticationError, ForbiddenError } from 'apollo-server'

import { DateTime } from './date-time'
import { Schema } from './utils'

export const notificationsSchema = new Schema()

export interface Notification {
  id: string
  type: string
  payload: string
  createdAt: DateTime
  seen: boolean
}

notificationsSchema.addTypeDef(gql`
  type Notification {
    id: String!
    type: String!
    payload: String!
    createdAt: DateTime!
    seen: Boolean!
  }
`)

export interface NotificationsPayload {
  user: number
  notifications: {
    id: number
    eventId: number
    seen: boolean
  }[]
}

export interface NotificationEventPayload {
  id: number
  type: string
  payload: string
  createdAt: DateTime
}

notificationsSchema.addQuery<unknown, undefined, Notification[]>(
  'notifications',
  async (_parent, _data, { dataSources, user }) => {
    if (user === null) {
      throw new AuthenticationError(
        'You need to log in to fetch your notifications'
      )
    }
    const { notifications } = await dataSources.serlo.getNotifications({
      user,
    })
    for (let i = 0; i < notifications.length; i++) {
      const event = await dataSources.serlo.getNotificationEvent({
        id: notifications[i].eventId,
      })
      notifications[i] = {
        id: notifications[i].id,
        createdAt: event.createdAt,
        type: event.type,
        payload: event.payload,
        seen: notifications[i].seen,
      }
    }
    return notifications
  }
)

notificationsSchema.addTypeDef(gql`
  extend type Query {
    notifications: [Notification!]!
  }
`)

/**
 * mutation _setNotifications
 */
notificationsSchema.addMutation<unknown, NotificationsPayload, null>(
  '_setNotifications',
  async (_parent, notifications, { dataSources, service }) => {
    if (service !== 'serlo.org') {
      throw new ForbiddenError(
        'You do not have the permissions to set notifications'
      )
    }
    await dataSources.serlo.setNotifications(notifications)
  }
)
notificationsSchema.addTypeDef(gql`
  input NotificationInput {
    id: Int!
    eventId: Int!
    seen: Boolean!
  }

  extend type Mutation {
    _setNotifications(user: Int!, notifications: [NotificationInput!]!): Boolean
  }
`)

/**
 * mutation _setNotificationEvent
 */
notificationsSchema.addMutation<unknown, NotificationEventPayload, null>(
  '_setNotificationEvent',
  async (_parent, event, { dataSources, service }) => {
    if (service !== 'serlo.org') {
      throw new ForbiddenError(
        'You do not have the permissions to set an event'
      )
    }
    await dataSources.serlo.setNotificationEvent(event)
  }
)
notificationsSchema.addTypeDef(gql`
  extend type Mutation {
    _setNotificationEvent(
      id: Int!
      type: String!
      payload: String!
      createdAt: DateTime!
    ): Boolean
  }
`)
