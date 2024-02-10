import { headers } from "next/headers";

export const fetchCsrfToken = async () => {
    try {
        const host = headers().get("host");
        const protocal = process?.env.NODE_ENV === "development" ? "http" : "https"
        let res = await fetch(`${protocal}://${host}/api/auth/csrf`, { cache: "no-store" });

        if (!res.ok) {
            console.warn('CSRF RESPONSE not ok!!🔥')
            throw new Error('Failed to fetch CSRF token');
        }
        const data = await res.json() as { csrfToken: string };
        console.log("csrfToken", data.csrfToken)

        return data.csrfToken;
    } catch (error) {
        console.error('❌Error fetching CSRF token:', error);
    }
};
