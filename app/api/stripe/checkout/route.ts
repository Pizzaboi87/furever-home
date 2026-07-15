import { NextResponse } from 'next/server'

import { getStripeEnv, getValidatedAppBaseUrl } from '@/lib/server/env'
import { enforcePublicRateLimit } from '@/lib/server/rate-limit'

type DonationFrequency = 'one_time' | 'monthly'

type DonationCheckoutPayload = {
  amount: number
  frequency: DonationFrequency
  donorEmail?: string
}

type StripeCheckoutSessionResponse = {
  id?: string
  url?: string | null
}

type StripeErrorResponse = {
  error?: {
    message?: string
  }
}

const MIN_DONATION_CENTS = 100
const MAX_DONATION_CENTS = 500_000

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

const isDonationFrequency = (value: unknown): value is DonationFrequency => {
  return value === 'one_time' || value === 'monthly'
}

const isValidEmail = (value: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

const getAppBaseUrl = () => {
  return getValidatedAppBaseUrl()
}

const parseDonationCheckoutPayload = (payload: unknown): DonationCheckoutPayload | null => {
  if (!isRecord(payload)) {
    return null
  }

  const amount = payload.amount
  const frequency = payload.frequency
  const donorEmail = payload.donorEmail

  if (typeof amount !== 'number' || !Number.isFinite(amount)) {
    return null
  }

  if (!isDonationFrequency(frequency)) {
    return null
  }

  if (donorEmail !== undefined && typeof donorEmail !== 'string') {
    return null
  }

  const trimmedEmail = donorEmail?.trim()

  if (trimmedEmail && !isValidEmail(trimmedEmail)) {
    return null
  }

  return {
    amount,
    frequency,
    donorEmail: trimmedEmail || undefined,
  }
}

const readStripeErrorMessage = async (response: Response) => {
  const body = (await response.json().catch(() => null)) as unknown

  if (!isRecord(body)) {
    return 'Stripe could not create the checkout session.'
  }

  const stripeError = body as StripeErrorResponse

  return stripeError.error?.message ?? 'Stripe could not create the checkout session.'
}

export async function POST(request: Request) {
  const rateLimitResponse = await enforcePublicRateLimit(request, {
    scope: 'stripe-checkout',
    limit: 10,
    windowMs: 10 * 60 * 1000,
  })

  if (rateLimitResponse) {
    return rateLimitResponse
  }

  let secretKey: string

  try {
    secretKey = getStripeEnv().STRIPE_SECRET_KEY
  } catch {
    return NextResponse.json(
      { error: 'Stripe is not configured. Missing STRIPE_SECRET_KEY.' },
      { status: 500 },
    )
  }

  const payload = parseDonationCheckoutPayload(
    (await request.json().catch(() => null)) as unknown,
  )

  if (!payload) {
    return NextResponse.json(
      { error: 'Invalid donation request.' },
      { status: 400 },
    )
  }

  const amountInCents = Math.round(payload.amount * 100)

  if (
    !Number.isInteger(amountInCents) ||
    amountInCents < MIN_DONATION_CENTS ||
    amountInCents > MAX_DONATION_CENTS
  ) {
    return NextResponse.json(
      { error: 'Donation amount must be between $1 and $5,000.' },
      { status: 400 },
    )
  }

  const isRecurringDonation = payload.frequency === 'monthly'
  const appBaseUrl = getAppBaseUrl()
  const params = new URLSearchParams()

  params.set('mode', isRecurringDonation ? 'subscription' : 'payment')
  params.set('success_url', `${appBaseUrl}/donate/success?session_id={CHECKOUT_SESSION_ID}`)
  params.set('cancel_url', `${appBaseUrl}/donate/cancel`)
  params.set('line_items[0][quantity]', '1')
  params.set('line_items[0][price_data][currency]', 'usd')
  params.set('line_items[0][price_data][unit_amount]', String(amountInCents))
  params.set(
    'line_items[0][price_data][product_data][name]',
    isRecurringDonation ? 'Furever Home Monthly Donation' : 'Furever Home Donation',
  )
  params.set(
    'line_items[0][price_data][product_data][description]',
    'Support rescue, care, adoption, and shelter operations at Furever Home.',
  )
  params.set('metadata[donation_frequency]', payload.frequency)
  params.set('metadata[donation_amount_cents]', String(amountInCents))
  params.set('client_reference_id', `donation_${crypto.randomUUID()}`)
  params.set('allow_promotion_codes', 'true')

  if (payload.donorEmail) {
    params.set('customer_email', payload.donorEmail)
  }

  if (isRecurringDonation) {
    params.set('line_items[0][price_data][recurring][interval]', 'month')
    params.set('subscription_data[metadata][donation_frequency]', payload.frequency)
    params.set('subscription_data[metadata][donation_amount_cents]', String(amountInCents))
  } else {
    params.set('submit_type', 'donate')
    params.set('payment_intent_data[metadata][donation_frequency]', payload.frequency)
    params.set('payment_intent_data[metadata][donation_amount_cents]', String(amountInCents))
  }

  const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  })

  if (!stripeResponse.ok) {
    return NextResponse.json(
      { error: await readStripeErrorMessage(stripeResponse) },
      { status: 502 },
    )
  }

  const checkoutSession = (await stripeResponse.json()) as StripeCheckoutSessionResponse

  if (!checkoutSession.url) {
    return NextResponse.json(
      { error: 'Stripe did not return a checkout URL.' },
      { status: 502 },
    )
  }

  return NextResponse.json({ url: checkoutSession.url })
}
