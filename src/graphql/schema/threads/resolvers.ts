import { Resolver } from '../types'
import { requestsOnlyFields } from '../utils'
import { User, UserPayload, resolveUser } from '../uuid'
import { Comment } from './types'

export const resolvers: {
  Comment: {
    author: Resolver<Comment, never, Partial<User>>
  }
} = {
  Comment: {
    async author(comment, _args, { dataSources }, info) {
      const partialUser = { id: comment.authorId }
      if (requestsOnlyFields('User', ['id'], info)) {
        return partialUser
      }
      const data = await dataSources.serlo.getUuid<UserPayload>(partialUser)
      return resolveUser(data)
    },
  },
}
