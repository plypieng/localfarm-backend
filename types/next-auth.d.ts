import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // Add other custom session properties here
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    // Add custom user properties here
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    // Add other custom JWT properties here
  }
}
