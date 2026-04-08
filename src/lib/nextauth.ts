// import { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { AuthOptions } from "next-auth"



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
      password: { label: "Password", type: "password" }
    }, 
    async authorize(credentials) {

      const res = await fetch("https://pnm6zhh3-7127.uks1.devtunnels.ms/api/Authentication/login", {
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
        signIn: '/login/job-seeker',
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

          if(user && account?.provider === 'google'){

            const res = await fetch("https://pnm6zhh3-7127.uks1.devtunnels.ms/api/Authentication/google-login", {
              method: 'POST',
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({idToken: account.id_token})

          })

          const data = await res.json()
          console.log('final res google', data);
          token.id = data.id ;
          token.displayName = data.displayName;
          token.email = data.email;
          token.role  = data.roles[0] as "Seeker" | "Company";
          token.accessToken = data.token
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


    secret: process.env.BETTER_AUTH_SECRET,

}