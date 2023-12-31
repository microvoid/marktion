import { prisma } from '@/libs';
import { Session, User } from '@prisma/client';
import { cookies } from 'next/headers';
import { GUEST_SESSION_ID } from '@/libs';
import { nanoid } from 'nanoid';

import { userService } from '../services';
import { seedHelper } from '../helpers';

class GuestAuth {
  async getSession() {
    const cookieStore = cookies();
    const sessionId = cookieStore.get(GUEST_SESSION_ID);

    if (sessionId?.value) {
      const session = await prisma.session.findUnique({
        where: {
          id: sessionId.value
        },
        include: {
          user: true
        }
      });

      if (!session || !isValidDatabaseSession(session)) {
        return null;
      }

      return session;
    }

    return null;
  }

  async getSessionUser() {
    const session = await this.getSession();
    return session && session.user;
  }

  async setSession(user: User) {
    const expires = Date.now() + TEN_YEARS;
    const session = await prisma.session.create({
      data: {
        id: nanoid(40),
        user_id: user.id,
        active_expires: expires,
        idle_expires: expires
      }
    });

    return session;
  }

  async autoGuestSession() {
    let session = await this.getSession();

    if (session) {
      return {
        user: session!.user,
        sessionId: session!.id
      };
    }

    const user = await userService.createGuest();
    const newSession = await this.setSession(user);

    await seedHelper.seedUserDefaultProject(user);

    return {
      user,
      sessionId: newSession.id
    };
  }
}

const TEN_YEARS = 10 * 365 * 24 * 60 * 60 * 1000;

function isValidDatabaseSession(session: Session) {
  const currentTime = Date.now();
  if (currentTime > Number(session.idle_expires)) return false;
  return true;
}

export const guestAuth = new GuestAuth();
