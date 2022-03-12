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
        // if (credentials.type === 'new_user') {
        //   const doc = {
        //     _id:credentials.id,
        //     _type:'user',
        //     userName: credentials.userName,
        //     image: 'https://png.pngtree.com/png-clipart/20210129/ourmid/pngtree-man-default-avatar-png-image_2813122.jpg',
        //     email: credentials.email,
        //   };
          
        //   const user = await client.createIfNotExists(doc);

        //   return {
        //     id:user._id,
        //     name: user.userName,
        //     email: user.email,
        //     image: user.image
        //   };
          
        // }
        // else {

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
          // const isValid = credentials.password === userData[0].password;
  
          if (!isValid) {
            throw new Error('Wrong Password!');
        }
        
        return {
          id:userData[0]._id,
          name: userData[0].userName,
          email: userData[0].email,
          image: userData[0].image
        };
          // }
      }
        })
      ]
})