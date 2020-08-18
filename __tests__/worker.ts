import CacheWorker from '../src/worker'
import { getGraphQLOptions } from '../src/graphql'
import { ApolloServer } from 'apollo-server-express'
import { createInMemoryCache } from '../src/cache/in-memory-cache'
import { graphql, rest } from 'msw'
import { GraphQLRequest } from 'apollo-server-types'
import { Service } from '../src/graphql/schema/types'

const cache = createInMemoryCache()

const mockKeysValues = new Map([...Array(25).keys()].map((x) => ['key'+x, 'value'+x]))

let worker: CacheWorker

let server: ApolloServer

beforeEach(async () => {
  await cache.set('de.serlo.org/api/cache-keys', [...mockKeysValues.keys()])
  server = new ApolloServer({
    ...getGraphQLOptions({ cache }),
    context: {
      service: Service.Serlo,
      user: null,
    },
  })
  worker = new CacheWorker({
    apiEndpoint: 'https://api.serlo.org/graphql',
    service: Service.Serlo,
    secret: 'blllkjadf',
  })

  
  const serloApi = graphql.link('https://api.serlo.org/graphql')

  global.server.use(
/*  // this one works as expected
    rest.post('https://api.serlo.org/graphql', async (req, res, ctx) => {
      // console.log(req)
      return res(
        ctx.json(
          await server.executeOperation({
            query: worker.queryLiteral,
          } as GraphQLRequest)
        )
      )
    }), */
    serloApi.query('_cacheKeys', async(req, res, ctx) =>{
      return res(
        ctx.data(
          await server.executeOperation({
            query: worker.queryLiteral,
          } as GraphQLRequest)
        )
      )
    })
  )
})

describe('Update-cache worker', () => {
  test('updates the whole cache', async () => {
    await worker.updateWholeCache()
  })
})
