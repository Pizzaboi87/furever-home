import { NextResponse } from 'next/server'

import {
  hasFilledPublicInquiryHoneypot,
  parsePublicInquiryPayload,
  type PublicInquiryPayload,
  type PublicInquirySource,
} from '@/lib/public-inquiry-validation'
import { enforcePublicRateLimit } from '@/lib/server/rate-limit'
import { getResendEnv } from '@/lib/server/env'

type ResendEmailResponse = {
  id?: string
  message?: string
  name?: string
}

const DEFAULT_EMAIL_LOGO_URL =
  'https://res.cloudinary.com/qkqapvzs/image/upload/v1783597447/logo-white_icwify.png'

const sourceLabels: Record<PublicInquirySource, string> = {
  start_adoption: 'Start Adoption',
  virtual_adoption: 'Virtual Adoption',
  pet_question: 'Pet Question',
  volunteer: 'Volunteer / Contact Us',
  contact: 'General Contact Us',
}

const sourceSubjects: Record<PublicInquirySource, string> = {
  start_adoption: 'New adoption interest',
  virtual_adoption: 'New virtual adoption interest',
  pet_question: 'New pet question',
  volunteer: 'New volunteer inquiry',
  contact: 'New website contact inquiry',
}

const escapeHtml = (value: string) => {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

const parseResendResponse = (value: unknown): ResendEmailResponse | null => {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  const record = value as Record<string, unknown>

  return {
    id: typeof record.id === 'string' ? record.id : undefined,
    message: typeof record.message === 'string' ? record.message : undefined,
    name: typeof record.name === 'string' ? record.name : undefined,
  }
}

const buildSubject = (payload: PublicInquiryPayload) => {
  const baseSubject = sourceSubjects[payload.source]

  if (payload.petName) {
    return `[Furever Home] ${baseSubject} - ${payload.petName}`
  }

  if (payload.subject) {
    return `[Furever Home] ${baseSubject} - ${payload.subject}`
  }

  return `[Furever Home] ${baseSubject}`
}

const buildRows = (payload: PublicInquiryPayload): Array<[string, string]> => {
  return [
    ['Form source', sourceLabels[payload.source]],
    ['Name', payload.name],
    ['Email', payload.email],
    ['Phone', payload.phone],
    ['Pet', payload.petName],
    ['Subject', payload.subject],
    ['Availability', payload.availability],
  ].filter((row): row is [string, string] => row[1].length > 0)
}

const buildTextEmail = (payload: PublicInquiryPayload) => {
  const rows = buildRows(payload)
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n')

  return `${rows}\n\nMessage:\n${payload.message}`
}

const buildHtmlEmail = (payload: PublicInquiryPayload, logoUrl: string) => {
  const rows = buildRows(payload)
    .map(([label, value]) => {
      return `<tr><td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;vertical-align:top;width:160px;">${escapeHtml(label)}</td><td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:15px;font-weight:600;line-height:1.5;vertical-align:top;">${escapeHtml(value)}</td></tr>`
    })
    .join('')

  const logoMarkup = `<img src="${escapeHtml(logoUrl)}" width="44" height="44" alt="Furever Home" style="display:block;width:44px;height:44px;border-radius:10px;background:#5f57e7;padding:6px;" />`

  return `
    <div style="margin:0;padding:28px;background:#f8fafc;font-family:Inter,Arial,sans-serif;color:#111827;">
      <div style="max-width:680px;margin:0 auto;">
        <div style="border:1px solid #e5e7eb;border-radius:18px;overflow:hidden;background:#ffffff;box-shadow:0 12px 30px rgba(15,23,42,.08);">
          <div style="background:#f5f3ff;padding:24px 28px;border-bottom:1px solid #e5e7eb;">
            <table role="presentation" style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="width:56px;vertical-align:middle;">${logoMarkup}</td>
                <td style="vertical-align:middle;padding-left:14px;">
                  <p style="margin:0 0 5px;color:#5f57e7;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;">${escapeHtml(sourceLabels[payload.source])}</p>
                  <h1 style="margin:0;color:#111827;font-size:24px;line-height:1.25;font-weight:800;">${escapeHtml(buildSubject(payload).replace('[Furever Home] ', ''))}</h1>
                </td>
              </tr>
            </table>
          </div>

          <table style="width:100%;border-collapse:collapse;">${rows}</table>

          <div style="padding:24px 28px 28px;">
            <h2 style="margin:0 0 12px;color:#111827;font-size:18px;line-height:1.35;font-weight:800;">Message</h2>
            <div style="white-space:pre-wrap;margin:0;color:#1f2937;background:#f9fafb;border:1px solid #e5e7eb;border-radius:14px;padding:18px;font-size:16px;line-height:1.75;">${escapeHtml(payload.message)}</div>
          </div>
        </div>

        <p style="margin:18px 0 0;color:#6b7280;font-size:12px;line-height:1.5;text-align:center;">
          This message was sent from a Furever Home public website form.
        </p>
      </div>
    </div>
  `
}

export async function POST(request: Request) {
  const rateLimitResponse = await enforcePublicRateLimit(request, {
    scope: 'contact',
    limit: 5,
    windowMs: 10 * 60 * 1000,
  })

  if (rateLimitResponse) {
    return rateLimitResponse
  }

  let resendEnv: ReturnType<typeof getResendEnv>

  try {
    resendEnv = getResendEnv()
  } catch {
    return NextResponse.json(
      { error: 'Email service is not configured yet.' },
      { status: 500 },
    )
  }

  const requestPayload = await request.json().catch(() => null)

  if (hasFilledPublicInquiryHoneypot(requestPayload)) {
    return NextResponse.json({ ok: true })
  }

  const parsedPayload = parsePublicInquiryPayload(requestPayload)

  if (!parsedPayload.success) {
    return NextResponse.json({ error: parsedPayload.error }, { status: 400 })
  }

  const payload = parsedPayload.data

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendEnv.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: resendEnv.RESEND_FROM_EMAIL,
      to: [resendEnv.RESEND_TO_EMAIL],
      reply_to: payload.email,
      subject: buildSubject(payload),
      text: buildTextEmail(payload),
      html: buildHtmlEmail(
        payload,
        resendEnv.RESEND_LOGO_URL ?? DEFAULT_EMAIL_LOGO_URL,
      ),
    }),
  })

  const resendResponse = parseResendResponse(await response.json().catch(() => null))

  if (!response.ok) {
    return NextResponse.json(
      {
        error:
          resendResponse?.message ??
          'Could not send your message. Please try again later.',
      },
      { status: 502 },
    )
  }

  return NextResponse.json({ ok: true, id: resendResponse?.id ?? null })
}
