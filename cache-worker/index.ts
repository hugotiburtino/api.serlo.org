import { CacheWorker, Service } from './src/cache-worker'

const apiEndpoint = process.env.SERLO_ORG_HOST
const secret = process.env.SERLO_ORG_SECRET
const service = process.env.SERLO_SERVICE as Service
const cacheKeys = process.env.CACHE_KEYS

const cw = new CacheWorker({ apiEndpoint, secret, service })

let tries = 0
const MAX_TRIES = 3

async function tryUpdate() {
  while (tries < MAX_TRIES) {
    cw.errLog = []
    console.log('Updating cache values of the following keys:', cacheKeys)
    await cw.updateCache(cacheKeys!)
    if (cw.errLog == []) break
    tries++
  }
}

tryUpdate().then(() => {
  if (cw.errLog.length) {
    console.warn(
      'Cache update was run but the following errors were found',
      cw.errLog
    )
  } else {
    console.log('Cache successfully updated')
  }
})
