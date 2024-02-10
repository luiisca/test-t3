import { cookies } from "next/headers";
import parseUrl from "~/utils/parse-url";

export const fetchCsrfToken = async () => {
    try {
        console.log('-------------🤯fetchCsrfToken()---------')

        const baseUrlServer = parseUrl(
            process.env.NEXTAUTH_URL ??
            process.env.VERCEL_URL
        ).origin
        const basePathServer = parseUrl(
            process.env.NEXTAUTH_URL
        ).path
        console.log("fetch url", `${baseUrlServer}${basePathServer}/csrf`)

        const options: RequestInit = {
            headers: {
                "Content-Type": "application/json",
                cookie: cookies().toString()
            },
        }
        const res = await fetch(`${baseUrlServer}${basePathServer}/csrf`, options);
        console.warn('CSRF RESPONSE 🎁', res)
        const data = await res.json() as { csrfToken: string };
        console.warn('CSRF RESPONSE.json 🎁', data)

        if (!res.ok) {
            console.warn('CSRF RESPONSE not ok!!🔥')
            throw data;
        }
        console.log("csrfToken", data.csrfToken)

        return Object.keys(data).length > 0 ? data : null // Return null if data empty

        console.log('-------------✅fetchCsrfToken() END---------')
    } catch (error) {
        console.error('❌Error fetching CSRF token:', error);

        return null
    }
};
