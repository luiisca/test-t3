// import { cookies } from "next/headers";
import { getCsrfToken } from "next-auth/react";

import { env } from "~/env";
// import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";

export default async function Simulation() {
    const session = await getServerAuthSession();
    const csrfToken = await getCsrfToken()
    console.log('Simulation - csrfToken', csrfToken)

    if (!session?.user) {
        // return redirect('/auth/login')
        return (
            <p>
                Not Authenticated!
            </p>
        )
    } else {
        return (
            <div>
                <h1>Simulation</h1>

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
