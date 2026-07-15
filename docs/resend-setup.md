# Resend setup

The public forms send structured email notifications through `POST /api/contact`.

## Forms covered

- Pet detail: Start Adoption modal
- Pet detail: Virtual Adoption modal
- Pet detail: I Have a Question modal
- Volunteer page: volunteer contact modal
- Footer: Contact Us modal

All messages include a `source` value so staff can categorize where the inquiry came from.

## Environment variables

Add these values to `.env` locally and to Vercel when deployed:

```env
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="Furever Home <onboarding@resend.dev>"
RESEND_TO_EMAIL="staff@example.com"
APP_BASE_URL="http://localhost:3000"
```

For production, use a verified domain in Resend and replace the sender with your own domain:

```env
RESEND_FROM_EMAIL="Furever Home <hello@your-domain.com>"
APP_BASE_URL="https://your-vercel-domain.vercel.app"
```

`APP_BASE_URL` is also used to render the logo inside the HTML email.

## Local testing

1. Start the app with `npm run dev`.
2. Submit each public inquiry modal.
3. Check the inbox configured in `RESEND_TO_EMAIL`.
4. Confirm the subject line includes the form category.

Expected subject examples:

- `[Furever Home] New adoption interest - Luna`
- `[Furever Home] New virtual adoption interest - Max`
- `[Furever Home] New pet question - Milo`
- `[Furever Home] New volunteer inquiry - Volunteer inquiry`
- `[Furever Home] New website contact inquiry - General website inquiry`

## Notes

The form submission does not automatically create admin cases. Staff can review the email and create a case manually when follow-up is needed.
