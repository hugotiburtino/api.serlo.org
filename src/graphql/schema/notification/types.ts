import {
  AbstractNotificationEvent,
  QueryNotificationEventArgs,
} from '../../../types'
import { QueryResolver, TypeResolver } from '../types'
import { CreateCommentNotificationEventPreResolver } from './create-comment-notification-event'
import { CreateThreadNotificationEventPreResolver } from './create-thread-notification-event'
import { SetThreadStateNotificationEventPreResolver } from './set-thread-state-notification-event'

export enum NotificationEventType {
  CreateComment = 'CreateCommentNotificationEvent',
  CreateThread = 'CreateThreadNotificationEvent',
  SetThreadState = 'SetThreadStateNotificationEvent',
}

export type NotificationEventPreResolver =
  | CreateCommentNotificationEventPreResolver
  | CreateThreadNotificationEventPreResolver
  | SetThreadStateNotificationEventPreResolver
export interface AbstractNotificationEventPreResolver
  extends AbstractNotificationEvent {
  __typename: NotificationEventType
}

export type NotificationEventPayload = NotificationEventPreResolver
export type AbstractNotificationEventPayload = AbstractNotificationEventPreResolver

export interface NotificationResolvers {
  AbstractNotificationEvent: {
    __resolveType: TypeResolver<NotificationEventPreResolver>
  }
  Query: {
    notificationEvent: QueryResolver<
      QueryNotificationEventArgs,
      NotificationEventPreResolver
    >
  }
}
