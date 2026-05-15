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
        const isCompanyRegister =
          account.provider === "google-company-register";

        // ─── Read registration form data from cookies ─────────────
        // These are set by the register form before the OAuth redirect.
        const companyName =
          cookieStore.get("google_reg_companyName")?.value ?? "";
        const domain = cookieStore.get("google_reg_domain")?.value ?? null;
        const description =
          cookieStore.get("google_reg_description")?.value ?? null;

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
