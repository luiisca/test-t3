import { headers } from "next/headers";

import { env } from "~/env";
// import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";

export default async function Simulation() {
    const session = await getServerAuthSession();

    if (!session?.user) {
        // return redirect('/auth/login')
        return (
            <p>
                Authenticated!
            </p>
        )
    } else {
        const csrfToken = (await fetch(`${env.NEXTAUTH_URL}/api/auth/csrf`, {
            headers: headers()
        }).then(res => res.json()) as {
            csrfToken: string
        }).csrfToken

        return (
            <div>
                <h1>Simulation</h1>
                <p>Not Authenticated!</p>

                <form
                    method="POST"
                    action={`${env.NEXTAUTH_URL}/api/auth/signout`}
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
}
