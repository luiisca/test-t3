// import { headers } from "next/headers";

import { env } from "~/env";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";

export default async function Login() {
    const session = await getServerAuthSession();

    if (session?.user) {
        return redirect('/simulation')
    } else {
        // const csrfToken = (await fetch(`${env.NEXTAUTH_URL}/api/auth/csrf`, {
        //     headers: headers()
        // }).then(res => res.json()) as {
        //     csrfToken: string
        // }).csrfToken

        return (
            <div>
                <p>Authenticated!</p>
                <form
                    method="POST"
                    action={`${env.NEXTAUTH_URL}/api/auth/signin/github`}
                    className="flex flex-col group gap-2">

                    <input
                        hidden
                        // value={csrfToken}
                        value='hey'
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

