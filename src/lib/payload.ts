import { getPayload } from 'payload'
import config from '@/payload.config'

/**
 * Returns a cached Payload local-API client for use in Server Components,
 * server actions, and scripts. No HTTP round-trip — queries hit the DB directly.
 */
export const getPayloadClient = async () => {
  return getPayload({ config: await config })
}
