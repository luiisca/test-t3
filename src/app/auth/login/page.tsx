import { cookies } from "next/headers";
import { getCsrfToken } from "next-auth/react";

import { env } from "~/env";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";

export default async function Login({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined } & { error: string }
}) {
    const session = await getServerAuthSession();
    if (session?.user) {
        return redirect('/simulation')
    }

    const csrfToken = await getCsrfToken({
        req: {
            headers: {
                cookie: cookies().toString()
            }
        }
    })

    return (
        <div>
            <p className="text-red-600">{searchParams.error}</p>
            <form
                method="POST"
                action={`${env.NEXTAUTH_URL}/api/auth/signin/github?callbackUrl=${env.NEXTAUTH_URL}/simulation`}
                className="flex flex-col group gap-2">

                <input
                    hidden
                    value={csrfToken}
                    name="csrfToken"
                    readOnly />

                <button
                    className="outline-none 
                focus:underline focus:decoration-red-600 
                focus:group-valid:decoration-green-600">
                    Log in with Github
                </button>
            </form>
            <form
                method="POST"
                action={`${env.NEXTAUTH_URL}/api/auth/signin/email?callbackUrl=${env.NEXTAUTH_URL}/simulation`}
            >
                <input type="email" name='email' placeholder="example@email.com" required />
                <input
                    hidden
                    value={csrfToken}
                    name="csrfToken"
                    readOnly />

                <button
                    className="outline-none 
                focus:underline focus:decoration-red-600 
                focus:group-valid:decoration-green-600">
                    Send email
                </button>
            </form>
        </div>
    )
}

