import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { findUserByEmail } from './db';

export const authOptions: NextAuthOptions = {
  // Use Prisma Adapter if Prisma client is generated & connected
  adapter: prisma ? (PrismaAdapter(prisma) as any) : undefined,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
    signOut: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'admin@ecomflow.io' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password.');
        }

        const user = await findUserByEmail(credentials.email);

        if (!user || !user.password) {
          throw new Error('No account found with this email address.');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error('Incorrect password. Please try again.');
        }

        return {
          id: user.id,
          name: user.name || 'Admin User',
          email: user.email,
          image: user.image,
          workspaceName: user.workspaceName || 'Apex Global Brands',
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.workspaceName = (user as any).workspaceName || 'Apex Global Brands';
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).workspaceName = (token.workspaceName as string) || 'Apex Global Brands';
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'ecomflow_nextauth_secret_enterprise_2026_x89a2b4c6e8f',
};

export default authOptions;
