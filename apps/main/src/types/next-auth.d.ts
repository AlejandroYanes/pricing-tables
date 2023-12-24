/* eslint-disable max-len */
import { type DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string;
      role: string | null;
      customerId: string | null;
      isSetup: boolean;
      hasLegacySetup: boolean;
      hasSubscription: boolean;
    } & DefaultSession['user'];
  }

  interface AuthenticatedSession extends Session {
    user: {
      id: string;
      role: string | null;
      customerId: string | null;
      isSetup: boolean;
      hasLegacySetup: boolean;
      hasSubscription: boolean;
    } & DefaultSession['user'];
  }
}
