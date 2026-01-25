import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from './mongodb/dbConnect';
// In a real app, we'd have a User model. For this rebuild, we'll use env variables for admin.
// const User = ...

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Admin Login',
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (
                    credentials?.username === process.env.ADMIN_USER &&
                    credentials?.password === process.env.ADMIN_PASS
                ) {
                    return { id: '1', name: 'Admin' };
                }
                return null;
            }
        })
    ],
    pages: {
        signIn: '/admin/login',
    },
    session: {
        strategy: 'jwt' as const,
    },
};
