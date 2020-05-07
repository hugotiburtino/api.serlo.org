import {
  NotificationEventPayload,
  NotificationsPayload,
} from '../src/graphql/schema'

export const notifications: NotificationsPayload = {
  user: 1,
  notifications: [
    {
      id: 1,
      eventId: 1,
      seen: false,
    },
  ],
}

export const notificationEvent: NotificationEventPayload = {
  id: 1,
  createdAt: '2014-03-01T20:45:56Z',
  type: 'type',
  payload: 'payload',
}
