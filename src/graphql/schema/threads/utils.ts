import { Resolver } from '../types'
import { Uuid } from '../uuid'
import { Threads } from './types'

export type ThreadsResolver<T extends Uuid> = Resolver<T, never, Threads>

export function createThreadsResolver<T extends Uuid>(): ThreadsResolver<T> {
  return async function threads(parent, _args, { dataSources }) {
    const data = await dataSources.serlo.getThreads({ id: parent.id })
    const threads = await Promise.all(
      data.threadIds.map((id) => {
        return dataSources.serlo.getThread({ id }).then((data) => {
          // resolve Thread
          return data
        })
      })
    )
    return {
      totalCount: threads.length,
      nodes: threads,
    }
  }
}
