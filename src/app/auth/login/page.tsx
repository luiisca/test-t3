import { cookies, headers } from "next/headers";

import { env } from "~/env";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { fetchCsrfToken } from "~/app/get-csrf-token";

export default async function Login() {
    const session = await getServerAuthSession();
    const cookiesRes = cookies().getAll();
    console.log("------------🤯🤯🤯COOKIES START!!🤯🤯🤯--------")
    // headers().forEach((val, key) => console.log(key, val))
    console.log(cookiesRes)
    console.log("------------🎉🎉🎉COOKIES END!!🎉🎉🎉--------")


    const res = await fetch(`https://https://test-t3-orrb8jfu9-luiscadillo.vercel.app/api/auth/csrf`);
    console.warn('CSRF RESPONSE 🎁', res)
    const dataTest = await res.json() as { csrfToken: string };
    console.warn('CSRF RESPONSE.json 🎁', dataTest)

    if (!res.ok) {
        console.warn('CSRF RESPONSE not ok!!🔥')
        throw new Error('Failed to fetch CSRF token');
    }
    const data = await res.json() as { csrfToken: string };
    console.log("csrfToken", data.csrfToken)

    if (session?.user) {
        return redirect('/simulation')
    } else {
        const csrfToken = await fetchCsrfToken()

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

