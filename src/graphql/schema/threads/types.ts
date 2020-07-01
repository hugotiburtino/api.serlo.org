import { DateTime } from '../date-time'

export interface Thread {
  id: number
  createdAt: DateTime
  updatedAt: DateTime
  title: string
  archived: boolean
  trashed: boolean
  comments: Comments
}

export type Comment = CommentPayload

export interface ThreadPayload {
  id: number
  createdAt: DateTime
  updatedAt: DateTime
  title: string
  archived: boolean
  trashed: boolean
  comments: CommentPayload[]
}

export interface CommentPayload {
  id: number
  content: string
  createdAt: DateTime
  updatedAt: DateTime
  authorId: number
}

export interface ThreadsPayload {
  threadIds: number[]
  objectId: number
}

export interface Threads {
  totalCount: number
  nodes: Thread[]
}

export interface Comments {
  totalCount: number
  nodes: Comment[]
}
