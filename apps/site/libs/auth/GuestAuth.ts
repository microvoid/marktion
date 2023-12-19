import { cookies } from 'next/headers';
import { GUEST_SESSION_ID } from '@/common';

import { userService } from '../services';

class GuestAuth {
  async getSession() {
    const cookieStore = cookies();
    const guestCookie = cookieStore.get(GUEST_SESSION_ID);

    if (guestCookie?.value) {
      const guest = await userService.getUser(guestCookie?.value);
      return guest;
    }

    return null;
  }

  async autoGuest() {
    const guest = await this.getSession();

    if (guest) {
      return guest;
    }

    return userService.createGuest();
  }
}

export const guestAuth = new GuestAuth();
