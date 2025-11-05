import { DefaultSession } from "next-auth"
import { JWT as NextAuthJWT } from "next-auth/jwt"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's unique identifier */
      userId: string
      /** The user's name */
      name?: string | null
      /** The user's email address */
      email?: string | null
      /** The user's role */
      role: string
      /** Whether user is system admin */
      isSystemAdmin?: boolean
      /** Data fiduciary ID */
      dataFiduciaryId?: string | null
      /** When the user was created */
      createdAt?: string
      /** Access token for API calls */
      // access_token: string
      /** Refresh token for getting new access tokens */
      // refresh_token: string
    } & DefaultSession["user"]
    error?: string
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User {
    userId: string
    name?: string | null
    email?: string | null
    role: string
    isSystemAdmin?: boolean
    dataFiduciaryId?: string | null
    createdAt?: string
    accessToken: string
    refreshToken: string
  }

  /**
   * Usually contains information about the provider being used
   * and also extends `TokenSet`, which is different tokens returned by OAuth Providers.
   */
  interface Account {
    provider: string
    type: string
    id: string
    accessToken?: string
    refreshToken?: string
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends NextAuthJWT {
    /** The user's ID */
    id?: string
    /** The user's name */
    name?: string | null
    /** The user's email address */
    email?: string | null
    /** The user's role */
    role?: string
    /** Whether user is system admin */
    isSystemAdmin?: boolean
    /** Data fiduciary ID */
    dataFiduciaryId?: string | null
    /** When the token was created */
    createdAt?: string
    /** Access token for API calls */
    access_token?: string
    /** Refresh token for getting new access tokens */
    refresh_token?: string
    /** When the token expires */
    exp?: number
    /** When the token was issued */
    iat?: number
    /** Error message if authentication failed */
    error?: string
  }
}