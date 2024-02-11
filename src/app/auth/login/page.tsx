import { cookies } from "next/headers";
import { getCsrfToken, signIn } from "next-auth/react";

import { env } from "~/env";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import LoginBttn from "./login-bttn";

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
        console.log('Login - NEXTAUTH_URL', process.env.NEXTAUTH_URL, env.NEXTAUTH_URL)
        console.log('Login - VERCEL_URL', process.env.VERCEL_URL)
        const res = await fetch(`${env.NEXTAUTH_URL}/api/auth/providers`)
        const data = await res.json() as Record<string, string>[];
        if (!res.ok) {
            throw data
        }
        console.log('✅Login - Providers: ', data)
    } catch (error) {
        console.error(error)
    }

    // async function signInAction() {
    //     'use server'
    // }

    return (
        <div>
            <LoginBttn />
            {/* <form method="POST" action={signInAction}> */}
            {/*     <button */}
            {/*         className="outline-none  */}
            {/*     focus:underline focus:decoration-red-600  */}
            {/*     focus:group-valid:decoration-green-600"> */}
            {/*         Log in with Github */}
            {/*     </button> */}
            {/* </form> */}
            {/* <form */}
            {/*     method="POST" */}
            {/*     action={`${env.NEXTAUTH_URL}/api/auth/signin/github`} */}
            {/*     className="flex flex-col group gap-2"> */}
            {/**/}
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
            {/*         Log in */}
            {/*     </button> */}
            {/* </form> */}
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

