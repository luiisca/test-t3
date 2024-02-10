import { cookies } from "next/headers";
import { getCsrfToken } from "next-auth/react";

import { env } from "~/env";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import parseUrl from "~/utils/parse-url";

export default async function Simulation() {
    const session = await getServerAuthSession();

    if (!session?.user) {
        return redirect('/auth/login')
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
            <h1>Simulation</h1>

            <form
                method="POST"
                action={`${parseUrl(env.NEXTAUTH_URL ?? process.env.VERCEL_URL).origin}/api/auth/signout`}
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
                    Log out
                </button>
            </form>
        </div>

    )
}
