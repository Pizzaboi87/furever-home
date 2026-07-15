import { expect, test } from '@playwright/test'

type PublicPetsGraphQLResponse = {
  data?: {
    pets?: Array<{
      id: string
      name: string
      status: string
      isPublished: boolean
    }>
  }
  errors?: Array<{ message: string }>
}

test('public pets GraphQL query returns a valid payload', async ({ request }) => {
  const response = await request.post('/api/graphql', {
    data: {
      query: `
        query PublicPetsSmokeTest {
          pets {
            id
            name
            status
            isPublished
          }
        }
      `,
    },
  })

  expect(response.ok()).toBeTruthy()

  const payload = (await response.json()) as PublicPetsGraphQLResponse

  expect(payload.errors).toBeUndefined()
  expect(Array.isArray(payload.data?.pets)).toBeTruthy()
  expect(payload.data?.pets?.every((pet) => pet.isPublished)).toBeTruthy()
  expect(
    payload.data?.pets?.every((pet) =>
      ['available', 'new', 'reserved', 'adoption_in_progress'].includes(pet.status),
    ),
  ).toBeTruthy()
})
