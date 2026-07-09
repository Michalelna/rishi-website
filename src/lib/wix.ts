import { createClient, OAuthStrategy } from '@wix/sdk'
import { members } from '@wix/members'
import { wixEventsV2 as events, rsvp } from '@wix/events'
import { bookings } from '@wix/bookings'
import { posts as blog } from '@wix/blog'
import { plans as pricingPlans } from '@wix/pricing-plans'

const clientId = import.meta.env.VITE_WIX_CLIENT_ID

if (!clientId) {
  console.warn(
    '[Rishi] VITE_WIX_CLIENT_ID is not set. ' +
    'Add it to .env.local — see README for setup steps.'
  )
}

export const wixClient = createClient({
  modules: { members, events, rsvp, bookings, blog, pricingPlans },
  auth: OAuthStrategy({ clientId: clientId ?? '' }),
})

export type WixClient = typeof wixClient
