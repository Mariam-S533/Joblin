import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { AuthOptions } from "next-auth"
import { cookies } from "next/headers"



export const options: AuthOptions = {
  providers: [

    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string || '',
    }),

    CredentialsProvider({

    name: 'Credentials',

    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },

    async authorize(credentials) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
      const res = await fetch(`${baseUrl}/api/Authentication/login`, {
        method: 'POST',
        body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password
        }),
        headers: { "Content-Type": "application/json" }
      })
      const user  = await res.json()
      console.log('finallres auth',user);

      if (res.ok && user) {

        return {
                id: user.id,
                displayName: user.displayName,
                email: user.email,
                roles: user.roles,
                token: user.token
                }
              }

      return null
    }
  })
  ],

        session: {
            strategy: "jwt",
        },
 
    pages: {
        signIn: '/login/generalLogin',
    },

    callbacks: { 


        async jwt({ token, user, account }) {

            if(user && account?.provider === 'credentials'){
            token.id = user.id ;
            token.displayName = user.displayName;
            token.email = user.email;
            token.role  = user?.roles[0] as "Seeker" | "Company";
            token.accessToken = user.token
          }

            
            if(user && account?.provider === "google"){
              const cookieStore = await cookies()
              const authAction = cookieStore.get("auth_action")?.value
              const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

              let backendEndpoint = `${baseUrl}/api/Authentication/google-login`

              if(authAction === "register_company"){
                backendEndpoint = `${baseUrl}/api/Authentication/google-register-company`
              }
              else if(authAction === "register_seeker"){
                backendEndpoint = `${baseUrl}/api/Authentication/google-register-seeker`
              }

              try {
                const res = await fetch(backendEndpoint, {
                  method: 'POST',
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({idToken: account.id_token})  // sure which name it is 
                })

                const data = await res.json()

                if (res.ok) {
                  token.id = data.id
                  token.displayName = data.displayName
                  token.email = data.email
                  token.role = data.roles[0]
                  token.accessToken = data.token
                } else {
                  console.error("Backend error during Google auth:", data)
                }

                if (authAction) {
                  (await cookieStore).delete("auth_action")
                }
                
              } catch (error) {
                console.error("Fetch to custom backend failed of google:", error)
              }

            }


          return token

        },

        async session({ session, token }) {
          session.id = token.id;
          session.displayName = token.displayName;
          session.email = token.email;
          session.role = token.role ;
          session.accessToken = token.accessToken;

            return session
        },
        

    },


    secret: process.env.AUTH_SECRET,

}