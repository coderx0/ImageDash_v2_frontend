import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "../../../lib/auth";
import GoogleProvider from "next-auth/providers/google";
import { client } from "../../../lib/sanityClient";

export default NextAuth({
  session: {
    jwt:true
  },
  pages: {
    error:'/authentication',
  },
  secret: process.env.SECRET,
  callbacks: {
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      session.user.id = token.sub;
      return session;

    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    CredentialsProvider({
      async authorize(credentials, req) {
        const query = `*[_type == "user" && email == '${credentials.email}']{
          userName,
          password,
          _id,
          email,
          image
        }`;
          const userData = await client.fetch(query);
          if (userData.length===0) {
            throw new Error('Invalid Email address!');
          }
  
          const isValid = await verifyPassword(
            credentials.password,
            userData[0].password
          );
  
          if (!isValid) {
            throw new Error('Wrong Password!');
        }
        
        return {
          id:userData[0]._id,
          name: userData[0].userName,
          email: userData[0].email,
          image: userData[0].image
        };
        
      }
        })
      ]
})