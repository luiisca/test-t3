import { cookies } from "next/headers";

import { env } from "~/env";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { getCsrfToken } from "next-auth/react";

export default async function Login() {
    const session = await getServerAuthSession();
    const cookiesRes = cookies().getAll();
    console.log("------------🤯🤯🤯COOKIES START!!🤯🤯🤯--------")
    // headers().forEach((val, key) => console.log(key, val))
    console.log(cookiesRes)
    console.log("------------🎉🎉🎉COOKIES END!!🎉🎉🎉--------")


    if (session?.user) {
        return redirect('/simulation')
    } else {
        const csrfToken = await getCsrfToken({
            req: {
                headers: {
                    cookie: cookies().toString()
                }
            }
        })

        return (
            <div>
                <p>Authenticated!</p>
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
            </div>
        )
    }
}

