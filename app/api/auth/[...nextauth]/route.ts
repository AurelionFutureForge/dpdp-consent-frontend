import NextAuth from "next-auth/next";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { parseApiError } from "@/lib/parse-api-errors";


const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text" },
        otp_id: { label: "OTP ID", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp || !credentials?.otp_id) {
          throw new Error("Email, OTP, and OTP ID are required.");
        }

        const backendUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-otp`;

        const requestBody = {
          email: credentials.email,
          otp: credentials.otp,
          otp_id: credentials.otp_id,
        };

        try {
          const response = await fetch(backendUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          });

          // Check content type before parsing JSON
          const contentType = response.headers.get("content-type");

          let result;
          try {
            const text = await response.text();

            if (contentType && contentType.includes("application/json")) {
              result = JSON.parse(text);
            } else {
              // If not JSON, try to parse anyway (might still be JSON)
              try {
                result = JSON.parse(text);
              } catch {
                // If parsing fails, create error object
                result = {
                  success: false,
                  message: { error: text || "Invalid response from server" }
                };
              }
            }
          } catch (parseError) {
            console.error("💥 [NextAuth] Failed to parse response:", parseError);
            throw new Error("Failed to parse server response");
          }

          if (!response.ok || !result.success) {
            // Handle error message - can be string or object with error property
            let errorMessage = "Authentication failed";

            if (result.message) {
              if (typeof result.message === 'string') {
                errorMessage = result.message;
              } else if (typeof result.message === 'object' && result.message.error) {
                errorMessage = result.message.error;
              }
            }

            // Throw error with the specific message - NextAuth will pass this to the client
            throw new Error(errorMessage);
          }

          const { data } = result;

          const { user_id, name, email, role, is_system_admin, data_fiduciary_id } = data;
          const { access_token, refresh_token } = data.token_data;

          const userObject = {
            id: user_id,
            userId: user_id,
            name,
            email,
            role,
            isSystemAdmin: is_system_admin,
            dataFiduciaryId: data_fiduciary_id,
            createdAt: new Date().toISOString(),
            accessToken: access_token,
            refreshToken: refresh_token,
          };

          return userObject;
        } catch (err) {
          // If it's already an Error with a message, use that directly
          // Otherwise try to parse it
          if (err instanceof Error && err.message && err.message !== "An unexpected error occurred") {
            throw err; // Re-throw the original error to preserve the message
          }

          // Try to parse the error if it's not already an Error
          const errorMessage = parseApiError(err);

          // Only use generic message if parseApiError returned the default
          if (errorMessage === "An unexpected error occurred") {
            throw new Error("Something went wrong during login. Please try again.");
          } else {
            throw new Error(errorMessage);
          }
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
  ],
  pages: {
    signIn: "/", // Custom sign-in page
    error: "/",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account && account.provider === 'google') {
        if (!user.email) {
          return false;
        }

        const backendUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`;

        const requestBody = {
          email: user.email,
          type: "SSO",
        };

        try {
          const response = await fetch(backendUrl, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
          });

          // Check content type before parsing JSON
          const contentType = response.headers.get("content-type");

          let backendData;
          try {
            const text = await response.text();

            if (contentType && contentType.includes("application/json")) {
              backendData = JSON.parse(text);
            } else {
              try {
                backendData = JSON.parse(text);
              } catch {
                backendData = {
                  success: false,
                  message: { error: text || "Invalid response from server" }
                };
              }
            }
          } catch (parseError) {
            console.error("💥 [NextAuth] Failed to parse response:", parseError);
            throw new Error("Failed to parse server response");
          }

          if (backendData.success === true && backendData.data) {
            const { data } = backendData;
            // Extract user data - same structure as MFA response
            const { user_id, name, email, role, is_system_admin, data_fiduciary_id } = data;
            const { access_token, refresh_token } = data.token_data;

            user.id = user_id;
            user.userId = user_id;
            user.name = name;
            user.email = email;
            user.role = role;
            user.isSystemAdmin = is_system_admin;
            user.dataFiduciaryId = data_fiduciary_id;
            user.createdAt = data.created_at || new Date().toISOString();
            user.accessToken = access_token;
            user.refreshToken = refresh_token;

            return true;
          } else {
            // Extract error message from response
            let errorMessage = "Authentication failed";
            if (backendData.message) {
              if (typeof backendData.message === 'string') {
                errorMessage = backendData.message;
              } else if (typeof backendData.message === 'object' && backendData.message.error) {
                errorMessage = backendData.message.error;
              }
            }
            // Store error message in temporary API endpoint
            // Use email as part of errorId so we can retrieve it later
            try {
              const errorId = `google_${user.email?.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`;
              await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/error`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ errorId, message: errorMessage }),
              });
            } catch (error) {
              console.error('💥 [NextAuth] Error storing error:', error);
            }

            return false;
          }
        } catch (error) {
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      // On initial sign in
      if (user) {
        // Add user info to token
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.isSystemAdmin = user.isSystemAdmin;
        token.dataFiduciaryId = user.dataFiduciaryId;
        token.createdAt = user.createdAt;
        token.access_token = user.accessToken;
        token.refresh_token = user.refreshToken;
      }

      // If session is being updated
      if (trigger === "update" && session?.user) {
        if (session.user.access_token) {
          token.access_token = session.user.access_token;
        }
        if (session.user.refresh_token) {
          token.refresh_token = session.user.refresh_token;
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Add user info to session but exclude sensitive tokens
      session.user = {
        userId: token.id as string,
        name: token.name,
        email: token.email,
        role: token.role as string,
        isSystemAdmin: token.isSystemAdmin as boolean,
        dataFiduciaryId: token.dataFiduciaryId as string | null,
        createdAt: token.createdAt as string,
        // Don't expose tokens to client
        // access_token: token.access_token as string,
        // refresh_token: token.refresh_token as string,
      };

      // If there's an error in the token, add it to the session
      if (token.error) {
        session.error = token.error as string;
      }

      return session;
    }
  }
}

const handler = NextAuth(authOptions);

// Export handlers directly - NextAuth handles route params internally
export { handler as GET, handler as POST };
