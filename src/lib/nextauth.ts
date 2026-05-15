import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";
import { cookies } from "next/headers";
import {
  googleLogin,
  googleRegisterCompany,
  login,
} from "@/services/authService";
import { ApiError } from "@/lib/apiClient/error";

// Only include Google provider when credentials are configured
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const useGoogleProvider = googleClientId && googleClientSecret;
const googleProviderConfig = {
  clientId: googleClientId as string,
  clientSecret: googleClientSecret as string,
};

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
            id: "google-company-register",
            name: "Google Company Register",
            ...googleProviderConfig,
          }),
          GoogleProvider({
            id: "google-company-login",
            name: "Google Company Login",
            ...googleProviderConfig,
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
        try {
          if (!credentials?.email || !credentials.password) {
            return null;
          }

          const user = await login({
            email: credentials.email,
            password: credentials.password,
          });

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
        } catch (error) {
          if (error instanceof Error) {
            throw error;
          }
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login/company",
    error: "/register/company",
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

      if (
        user &&
        (account?.provider === "google-company-register" ||
          account?.provider === "google-company-login")
      ) {
        const cookieStore = await cookies();
        const isCompanyRegister = account.provider === "google-company-register";

        // ─── Read registration form data from cookies ─────────────
        // These are set by the register form before the OAuth redirect.
        // Available across all auth actions so both the request builder
        // and the token assignment can access them.
        const companyName =
          cookieStore.get("google_reg_companyName")?.value ?? "";
        const domain = cookieStore.get("google_reg_domain")?.value ?? null;
        const description =
          cookieStore.get("google_reg_description")?.value ?? null;

        // ─── Mock mode: skip backend, return mock data ──────────────
        // In mock mode there is no real backend to call, so we construct
        // the token directly from the Google company provider and profile.
        if (USE_MOCK) {
          token.id = "mock-google-company-1";
          token.displayName = isCompanyRegister
            ? companyName || user.name || "Mock Google Company"
            : (user.name ?? "Mock Google Company");
          token.email = user.email ?? "";
          token.role = "Company";
          token.accessToken = "mock-google-jwt-company";

          // Clean up cookies in mock mode too
          const cookiesToDelete = [
            "google_reg_companyName",
            "google_reg_domain",
            "google_reg_description",
          ];
          for (const name of cookiesToDelete) {
            cookieStore.delete(name);
          }

          return token;
        }

        // ─── Real backend mode ──────────────────────────────────────
        try {
          const idToken = account.id_token ?? "";
          const effectiveCompanyName = companyName || user.name || "";

          if (isCompanyRegister) {
            console.info("[Google company register] Calling backend", {
              endpoint: "/Authentication/google-register-company",
              hasIdToken: Boolean(idToken),
              companyName: effectiveCompanyName,
              domain: domain || null,
              hasDescription: Boolean(description),
              googleEmail: user.email ?? null,
            });

            await googleRegisterCompany({
              idToken,
              companyName: effectiveCompanyName,
              domain: domain || null,
              description: description || null,
            });
          } else {
            await googleLogin({ idToken });
          }

          token.id = user.email ?? account.providerAccountId ?? "";
          token.displayName = isCompanyRegister
            ? effectiveCompanyName
            : (user.name ?? "");
          token.email = user.email ?? "";
          token.role = "Company";
          // NEEDS BACKEND CONFIRMATION: google-register-company/google-login
          // currently return only ProblemDetails { status }, not the app JWT.
          token.accessToken = idToken;

          // ─── Clean up auth action cookies ──────────────────────
          const cookiesToDelete = [
            "google_reg_companyName",
            "google_reg_domain",
            "google_reg_description",
          ];
          for (const name of cookiesToDelete) {
            cookieStore.delete(name);
          }
        } catch (error) {
          console.error("Google auth service call failed:", {
            message: error instanceof Error ? error.message : String(error),
            status: error instanceof ApiError ? error.status : undefined,
            provider: account.provider,
            operation: isCompanyRegister ? "register_company" : "login_company",
          });
          throw error;
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
