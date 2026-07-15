import { cache } from 'react'
import { redirect } from 'next/navigation'

import { auth0 } from '@/lib/auth0'
import { getPrismaClient } from '@/lib/server/prisma'

type Auth0SessionUser = {
  sub?: string
  email?: string
  name?: string
  picture?: string
}

export type CurrentStaff = {
  id: string
  name: string
  email: string
  role: string
}

const AUTH0_PROVIDER = 'auth0'

const normalizeEmail = (email: string) => email.trim().toLowerCase()

const getAuth0User = async (): Promise<Auth0SessionUser | null> => {
  const session = await auth0.getSession()

  if (!session?.user) {
    return null
  }

  return session.user
}

const touchStaffSignIn = async (staffId: string) => {
  await getPrismaClient().staffUser.update({
    where: { id: staffId },
    data: { lastSignedInAt: new Date() },
  })
}

const createAuth0AccountLink = async (staffId: string, auth0UserId: string) => {
  await getPrismaClient().account.upsert({
    where: {
      provider_providerAccountId: {
        provider: AUTH0_PROVIDER,
        providerAccountId: auth0UserId,
      },
    },
    update: {
      userId: staffId,
    },
    create: {
      id: `account-${AUTH0_PROVIDER}-${auth0UserId.replace(/[^a-zA-Z0-9_-]/g, '-')}`,
      userId: staffId,
      type: 'oidc',
      provider: AUTH0_PROVIDER,
      providerAccountId: auth0UserId,
    },
  })
}

const resolveCurrentStaff = async (): Promise<CurrentStaff | null> => {
  const auth0User = await getAuth0User()

  if (!auth0User?.sub) {
    return null
  }

  const prisma = getPrismaClient()
  const linkedAccount = await prisma.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider: AUTH0_PROVIDER,
        providerAccountId: auth0User.sub,
      },
    },
    include: {
      user: true,
    },
  })

  if (linkedAccount?.user.active) {
    await touchStaffSignIn(linkedAccount.user.id)

    return {
      id: linkedAccount.user.id,
      name: linkedAccount.user.name,
      email: linkedAccount.user.email,
      role: linkedAccount.user.role,
    }
  }

  if (!auth0User.email) {
    return null
  }

  const staff = await prisma.staffUser.findUnique({
    where: {
      email: normalizeEmail(auth0User.email),
    },
  })

  if (!staff?.active) {
    return null
  }

  await createAuth0AccountLink(staff.id, auth0User.sub)
  await touchStaffSignIn(staff.id)

  return {
    id: staff.id,
    name: staff.name,
    email: staff.email,
    role: staff.role,
  }
}

export const getCurrentStaff = cache(resolveCurrentStaff)

export const requireCurrentStaff = async (): Promise<CurrentStaff> => {
  const staff = await getCurrentStaff()

  if (!staff) {
    redirect('/admin/login')
  }

  return staff
}
