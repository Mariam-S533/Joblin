import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";
import { cookies } from "next/headers";

// Only include Google provider when credentials are configured
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const useGoogleProvider = googleClientId && googleClientSecret;

/** Whether to use mock data instead of the real .NET backend */
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

/** Mock users for testing without a backend */
const MOCK_USERS: Record<
  string,
  {
    id: string;
    displayName: string;
    email: string;
    roles: string[];
    token: string;
  }
> = {
  "company@mock.com": {
    id: "mock-company-1",
    displayName: "Mock Company Ltd",
    email: "company@mock.com",
    roles: ["Company"],
    token: "mock-jwt-token-company",
  },
  "seeker@mock.com": {
    id: "mock-seeker-1",
    displayName: "Mock Seeker",
    email: "seeker@mock.com",
    roles: ["Seeker"],
    token: "mock-jwt-token-seeker",
  },
};

export const options: AuthOptions = {
  providers: [
    ...(useGoogleProvider
      ? [
          GoogleProvider({
            clientId: googleClientId as string,
            clientSecret: googleClientSecret as string,
          }),
        ]
      : []),

    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        loginType: { label: "loginType", type: "text" },
      },
      async authorize(credentials) {
        // ─── Mock mode: bypass real backend ────────────────────────────
        if (USE_MOCK) {
          const mockUser = credentials?.email
            ? MOCK_USERS[credentials.email]
            : undefined;

          if (!mockUser) {
            // Allow any email/password combo in mock mode with a sensible default
            const loginType = credentials?.loginType ?? "Company";
            const role = loginType === "Company" ? "Company" : "Seeker";
            return {
              id: `mock-${role.toLowerCase()}-1`,
              displayName:
                role === "Company" ? "Mock Company Ltd" : "Mock Seeker",
              email: credentials?.email ?? `mock@${role.toLowerCase()}.com`,
              roles: [role],
              token: `mock-jwt-token-${role.toLowerCase()}`,
            };
          }

          // Validate role matches login type
          if (
            credentials?.loginType === "Seeker" &&
            mockUser.roles[0] === "Company"
          ) {
            throw new Error(
              "You are an Employer. Please use the Company login page.",
            );
          }
          if (
            credentials?.loginType === "Company" &&
            mockUser.roles[0] === "Seeker"
          ) {
            throw new Error(
              "You are a Job Seeker. Please use the Job Seeker login page.",
            );
          }

          return {
            id: mockUser.id,
            displayName: mockUser.displayName,
            email: mockUser.email,
            roles: mockUser.roles,
            token: mockUser.token,
          };
        }

        // ─── Real backend mode ─────────────────────────────────────────
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const res = await fetch(`${baseUrl}/api/Authentication/login`, {
          method: "POST",
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
          headers: { "Content-Type": "application/json" },
        });
        const user = await res.json();

        if (res.ok && user) {
          if (
            credentials?.loginType === "Seeker" &&
            user.roles[0] === "Company"
          ) {
            throw new Error(
              "You are an Employer. Please use the Company login page.",
            );
          }

          if (
            credentials?.loginType === "Company" &&
            user.roles[0] === "Seeker"
          ) {
            throw new Error(
              "You are a Job Seeker. Please use the Job Seeker login page.",
            );
          }

          return {
            id: user.id,
            displayName: user.displayName,
            email: user.email,
            roles: user.roles,
            token: user.token,
          };
        }

        return null;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login/job-seeker",
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account?.provider === "credentials") {
        token.id = user.id;
        token.displayName = user.displayName;
        token.email = user.email;
        token.role = user?.roles[0] as "Seeker" | "Company";
        token.accessToken = user.token;
      }

      if (user && account?.provider === "google") {
        const cookieStore = await cookies();
        const authAction = cookieStore.get("auth_action")?.value;
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

        // ─── Read registration form data from cookies ─────────────
        // These are set by the register form before the OAuth redirect.
        // Available across all auth actions so both the request builder
        // and the token assignment can access them.
        const companyName =
          cookieStore.get("google_reg_companyName")?.value ?? "";
        const domain = cookieStore.get("google_reg_domain")?.value ?? null;
        const description =
          cookieStore.get("google_reg_description")?.value ?? null;

        // ─── Build request payload based on auth action ──────────
        // For register_company: include companyName, domain, description
        // from cookies (set by the register form before OAuth redirect).
        // For register_seeker: include firstName, lastName from cookies.
        // For login: just send the idToken.
        let backendEndpoint = `${baseUrl}/api/Authentication/google-login`;
        let requestBody: Record<string, unknown> = {
          idToken: account.id_token,
        };

        if (authAction === "register_company") {
          backendEndpoint = `${baseUrl}/api/Authentication/google-register-company`;
          requestBody = {
            idToken: account.id_token,
            companyName,
            domain: domain || null,
            description: description || null,
          };
        } else if (authAction === "register_seeker") {
          backendEndpoint = `${baseUrl}/api/Authentication/google-register-seeker`;
          // Read seeker form data from cookies (to be implemented later)
          requestBody = { idToken: account.id_token };
        }

        try {
          const res = await fetch(backendEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
          });

          const raw = await res.json();

          // ─── Handle response shape ──────────────────────────────
          // google-register-company returns an ENVELOPED response:
          //   { success: true, data: { userId, email, token } }
          // google-login returns a FLAT response:
          //   { id, displayName, email, roles, token }
          if (res.ok) {
            if (authAction === "register_company") {
              // Enveloped response: extract data from wrapper
              const data = raw.success ? raw.data : raw;
              token.id = data.userId ?? data.id;
              token.displayName = companyName; // Use company name from registration form, not Google's personal name
              token.email = data.email;
              token.role = "Company";
              token.accessToken = data.token;
            } else {
              // Flat response (login / register-seeker)
              token.id = raw.id;
              token.displayName = raw.displayName ?? user.name ?? "";
              token.email = raw.email;
              token.role = raw.roles?.[0] ?? "Seeker";
              token.accessToken = raw.token;
            }
          } else {
            console.error("Backend error during Google auth:", raw);
          }

          // ─── Clean up registration cookies ──────────────────────
          if (authAction) {
            const cookiesToDelete = [
              "auth_action",
              "google_reg_companyName",
              "google_reg_domain",
              "google_reg_description",
            ];
            for (const name of cookiesToDelete) {
              cookieStore.delete(name);
            }
          }
        } catch (error) {
          console.error("Fetch to custom backend failed of google:", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.id = token.id;
      session.displayName = token.displayName;
      session.email = token.email;
      session.role = token.role;
      session.accessToken = token.accessToken;

      return session;
    },
  },

  secret: process.env.AUTH_SECRET,
};
