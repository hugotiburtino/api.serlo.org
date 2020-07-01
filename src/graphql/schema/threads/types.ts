export interface Thread {
  id: number
}

export interface ThreadPayload {
  id: number
  // comments: CommentPayload[]
}

// export interface CommentPayload {
//  id: number
//  authorId: number
//}

export interface ThreadsPayload {
  threadIds: number[]
  objectId: number
}

export interface Threads {
  totalCount: number
  nodes: Thread[]
}
