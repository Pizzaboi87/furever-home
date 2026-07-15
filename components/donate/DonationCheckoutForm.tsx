'use client'

import { useState } from 'react'

import MotionReveal from '@/components/ui/MotionReveal'

type DonationFrequency = 'one_time' | 'monthly'

type DonationLevel = {
  amount: number
  label: string
  description: string
}

type CheckoutResponse = {
  url?: string
  error?: string
}

const donationLevels: DonationLevel[] = [
  {
    amount: 10,
    label: 'Helper',
    description: 'Feeds an animal for a day',
  },
  {
    amount: 25,
    label: 'Supporter',
    description: 'Covers basic veterinary care',
  },
  {
    amount: 50,
    label: 'Guardian',
    description: 'Helps with adoption support',
  },
  {
    amount: 100,
    label: 'Champion',
    description: 'Supports our entire program',
  },
]

const frequencyOptions: Array<{
  value: DonationFrequency
  label: string
}> = [
    {
      value: 'one_time',
      label: 'One-time',
    },
    {
      value: 'monthly',
      label: 'Monthly',
    },
  ]

const parseCheckoutResponse = (value: unknown): CheckoutResponse => {
  if (typeof value !== 'object' || value === null) {
    return { error: 'Unexpected checkout response.' }
  }

  const record = value as Record<string, unknown>

  return {
    url: typeof record.url === 'string' ? record.url : undefined,
    error: typeof record.error === 'string' ? record.error : undefined,
  }
}

export default function DonationCheckoutForm() {
  const [selectedAmount, setSelectedAmount] = useState(25)
  const [frequency, setFrequency] = useState<DonationFrequency>('one_time')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formattedSelectedAmount = `$${selectedAmount.toFixed(2)}`

  const handleSubmit = async () => {
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedAmount,
          frequency,
        }),
      })

      const checkoutResponse = parseCheckoutResponse(await response.json().catch(() => null))

      if (!response.ok || !checkoutResponse.url) {
        setError(checkoutResponse.error ?? 'Could not start Stripe Checkout. Please try again.')
        setIsSubmitting(false)
        return
      }

      window.location.assign(checkoutResponse.url)
    } catch {
      setError('Could not start Stripe Checkout. Please check your connection and try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <section>
      <h2 className="text-2xl font-bold text-foreground mb-3">
        Donation Levels
      </h2>

      <p className="mb-4">
        Every level of support matters. Choose a one-time donation or become a monthly supporter so we can plan ongoing care with more confidence.
      </p>

      <div className="mb-5 grid grid-cols-2 gap-3" aria-label="Donation frequency">
        {frequencyOptions.map((option) => {
          const isSelected = option.value === frequency
          const helperText = option.value === 'monthly' ? 'Monthly care' : 'Single gift'

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setFrequency(option.value)}
              className={`cursor-pointer rounded-lg border-2 px-3 py-2 text-left transition-all duration-300 ease-in-out hover:scale-[1.02] ${isSelected
                ? 'border-primary bg-primary/10 shadow-sm'
                : 'border-border bg-white hover:border-primary'
                }`}
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <span
                  className={`h-2 w-2 rounded-full ${isSelected ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                  aria-hidden="true"
                />
                {option.label}
              </span>
              <span className="mt-0.5 block pl-4 text-xs font-medium text-muted-foreground">
                {helperText}
              </span>
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {donationLevels.map((level, index) => {
          const isSelected = selectedAmount === level.amount

          return (
            <MotionReveal key={level.amount} delay={index * 0.12}>
              <button
                type="button"
                onClick={() => setSelectedAmount(level.amount)}
                className={`w-full cursor-pointer rounded-lg border-2 p-4 text-left transition-all duration-300 ease-in-out hover:scale-105 ${isSelected
                  ? 'border-primary bg-primary/10 shadow-sm'
                  : 'border-border bg-white hover:border-primary'
                  }`}
              >
                <p className="font-semibold text-foreground mb-2">
                  ${level.amount} - {level.label}
                </p>
                <p className="text-sm text-muted-foreground">
                  {level.description}
                </p>
              </button>
            </MotionReveal>
          )
        })}
      </div>

      <div className="rounded-lg border border-border bg-secondary/40 p-4">
        <p className="text-sm font-semibold text-foreground">
          You are donating {formattedSelectedAmount}{' '}
          {frequency === 'monthly' ? 'every month' : 'today'}.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          You will be redirected to Stripe Checkout to complete your donation securely.
        </p>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="mt-6 cursor-pointer inline-flex w-auto items-center justify-center rounded-lg bg-linear-to-r from-[#5f57e7] to-primary px-7 py-3 font-semibold text-primary-foreground transition-all duration-300 ease-in-out hover:scale-[1.02] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
      >
        {isSubmitting ? 'Opening Stripe Checkout...' : 'Continue to Secure Donation'}
      </button>
    </section>
  )
}
