import { headers } from "next/headers";

import { env } from "~/env";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { fetchCsrfToken } from "~/app/get-csrf-token";

export default async function Login() {
    const session = await getServerAuthSession();
    console.log("------------🤯🤯🤯HEADERS!!🤯🤯🤯--------")
    headers().forEach((val, key) => console.log(key, val))
    console.log("------------🤯🤯🤯HEADERS!!🤯🤯🤯--------")

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

