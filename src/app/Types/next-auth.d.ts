import NextAuth from "next-auth"



declare module "next-auth" {
 
  interface Session {
    id: string,
    displayName: string,
    email: string,
    role: string,
    accessToken : string,
    // user: User
  }

  interface User{
    id: string,
    displayName: string,
    email: string,
    roles: string[],
    token: string
}

}


declare module "next-auth/jwt" {

  interface JWT {
    
        id: string,
        displayName: string,
        email: string,
        role: string,
        accessToken: string
  }
}