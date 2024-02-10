import { headers } from "next/headers";

import { env } from "~/env";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";

export default async function Login() {
    const session = await getServerAuthSession();
    console.log("------------🤯🤯🤯HEADERS!!🤯🤯🤯--------")
    headers().forEach((val, key) => console.log(key, val))
    console.log("------------🤯🤯🤯HEADERS!!🤯🤯🤯--------")

    if (session?.user) {
        return redirect('/simulation')
    } else {
        const fetchCsrfToken = async () => {
            try {
                const response = await fetch(`${env.NEXTAUTH_URL}/api/auth/csrf`, {
                    headers: headers()
                });
                if (!response.ok) {
                    console.warn('CSRF RESPONSE not ok!!🔥')
                    throw new Error('Failed to fetch CSRF token');
                }
                const data = await response.json() as { csrfToken: string };
                return data.csrfToken;
            } catch (error) {
                console.error('❌Error fetching CSRF token:', error);
                // Handle error
                // For example, you can redirect to an error page
            }
        };
        await fetchCsrfToken()
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

