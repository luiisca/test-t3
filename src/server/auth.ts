import { createElement } from 'react';

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
    getServerSession,
    type DefaultSession,
    type NextAuthOptions,
    Theme,
} from "next-auth";
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import EmailProvider, { SendVerificationRequestParams } from "next-auth/providers/email";
import { createTransport } from "nodemailer"
import { renderAsync } from '@react-email/render';
import Welcome from '~/emails/welcome'

import { env } from "~/env";
import { db } from "~/server/db";
import { TRPCError } from "@trpc/server";
import SMTPTransport from 'nodemailer/lib/smtp-transport';

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            // ...other properties
            // role: UserRole;
        } & DefaultSession["user"];
    }

    // interface User {
    //   // ...other properties
    //   // role: UserRole;
    // }
}

async function sendVerificationRequest(params: SendVerificationRequestParams) {
    const { identifier, url, provider, theme } = params
    const { host } = new URL(url)
    // NOTE: You are not required to use `nodemailer`, use whatever you want.
    const transport = createTransport(provider.server as Record<string, string>)

    const html = await renderAsync(createElement(Welcome, { url }));
    const text = await renderAsync(createElement(Welcome, { url }), {
        plainText: true
    });
    const result = await transport.sendMail({
        to: identifier,
        from: provider.from,
        subject: `Sign in to Budgetist`,
        text,
        html,
    })
    const failed = result.rejected.concat(result.pending).filter(Boolean)
    if (failed.length) {
        throw new TRPCError({ message: `Email(s) (${failed.join(", ")}) could not be sent`, code: "INTERNAL_SERVER_ERROR" })
    }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
    pages: {
        signIn: "/auth/login",
        signOut: "/auth/logout",
        error: "/auth/error", // Error code passed in query string as ?error=
        verifyRequest: "/auth/verify", // (used for check email message)
    },
    callbacks: {
        session: ({ session, user }) => ({
            ...session,
            user: {
                ...session.user,
                id: user.id,
            },
        }),
    },
    adapter: PrismaAdapter(db),
    providers: [
        GithubProvider({
            clientId: env.GITHUB_ID,
            clientSecret: env.GITHUB_SECRET,
        }),
        EmailProvider({
            server: {
                host: env.EMAIL_SERVER_HOST,
                port: env.EMAIL_SERVER_PORT,
                auth: {
                    user: env.EMAIL_SERVER_USER,
                    pass: env.EMAIL_SERVER_PASSWORD
                }
            },
            from: env.EMAIL_FROM,
            sendVerificationRequest
        })
        /**
         * ...add more providers here.
         *
         * Most other providers require a bit more work than the Discord provider. For example, the
         * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
         * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
         *
         * @see https://next-auth.js.org/providers/github
         */
    ],
    secret: process.env.NEXTAUTH_SECRET,
};
/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
