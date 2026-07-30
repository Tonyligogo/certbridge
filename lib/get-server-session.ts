import { headers } from 'next/headers'
import { auth } from './auth'
import { cache } from 'react'

export const getServerSession = cache(async () => {
  return await auth.api.getSession({
    headers: await headers()
})
}) //session deduplicated with the cache function, so multiple calls to getServerSession() will return the same session object within the same request.