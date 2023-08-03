import NextAuth,{ AuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialProvider from "next-auth/providers/credentials";
import prisma from "@/app/libs/prismadb";
import bcrypt from "bcrypt"
import { getSession } from "next-auth/react";

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
        CredentialProvider({
            name: 'credentials',
            credentials: {
                email: {label: 'email', type: 'text'},
                password: {label: 'password', type: 'password'},
                
            },
            async authorize(credentials){
                if (!credentials?.email || !credentials?.password){
                    throw new Error('Invalid credentials')
                }
                
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });

                if (!user || !user?.hashedPassword || !user?.emailVerified){
                    throw new Error('Invalid credentials')
                }
                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.hashedPassword
                );

                if(!isCorrectPassword){
                    throw new Error('Invalid Credentials');
                }

                return user;

            }
        })
    ],
    pages: {
        signIn: '/',
    },
    debug: process.env.NODE_ENV == 'development',
    session: {
        strategy: "jwt",
        maxAge:   3 * 60 * 60,
        
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
        maxAge:  3 * 60 * 60
        
    },
    
    
}

export default NextAuth(authOptions)