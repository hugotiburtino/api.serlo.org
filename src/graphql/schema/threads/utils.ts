import { Resolver } from '../types'
import { Uuid, resolveAbstractUuid, AbstractUuidPayload } from '../uuid'
import { Threads } from './types'

export type ThreadsResolver<T extends Uuid> = Resolver<T, never, Threads>

export function createThreadsResolver<T extends Uuid>(): ThreadsResolver<T> {
  return async function threads(parent, _args, { dataSources }) {
    const data = await dataSources.serlo.getThreads({ id: parent.id })

    const objectData = await dataSources.serlo.getUuid<AbstractUuidPayload>({
      id: parent.id,
    })
    const object = resolveAbstractUuid(objectData)
    const threads = await Promise.all(
      data.threadIds.map((id) => {
        return dataSources.serlo.getThread({ id }).then((data) => {
          // resolve Thread
          // TODO: comments result
          const { comments, ...rest } = data
          return {
            ...rest,
            object,
            comments: {
              totalCount: comments.length,
              nodes: comments,
            },
          }
        })
      })
    )
    return {
      totalCount: threads.length,
      nodes: threads,
    }
  }
}
