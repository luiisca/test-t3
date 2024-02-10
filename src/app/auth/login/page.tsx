import { cookies } from "next/headers";
import { getCsrfToken } from "next-auth/react";

import { env } from "~/env";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";

export default async function Login() {
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
    try {
        const res = await fetch(`${env.NEXTAUTH_URL}/api/auth/providers`)
        const data = await res.json() as Record<string, string>[];
        if (!res.ok) {
            throw data
        }
        console.log('✅Login - Providers: ', data)
    } catch (error) {
        console.error(error)
    }

    return (
        <div>
            <form
                method="POST"
                action={`${env.NEXTAUTH_URL}/api/auth/signin/github`}
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
                    Log in
                </button>
            </form>
            {/* <form */}
            {/*     method="POST"> */}
            {/*     <input */}
            {/*         hidden */}
            {/*         value={csrfToken} */}
            {/*         name="csrfToken" */}
            {/*         readOnly /> */}
            {/**/}
            {/*     <button */}
            {/*         className="outline-none  */}
            {/*     focus:underline focus:decoration-red-600  */}
            {/*     focus:group-valid:decoration-green-600"> */}
            {/*         Send email */}
            {/*     </button> */}
            {/* </form> */}
        </div>
    )
}

