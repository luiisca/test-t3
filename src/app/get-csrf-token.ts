// import { headers } from "next/headers";

export const fetchCsrfToken = async () => {
    try {
        const response = await fetch('https://test-t3-a43wjoq1m-luiscadillo.vercel.app/api/auth/csrf');
        if (!response.ok) {
            console.warn('CSRF RESPONSE not ok!!🔥')
            throw new Error('Failed to fetch CSRF token');
        }
        const data = await response.json() as { csrfToken: string };
        return data.csrfToken;
    } catch (error) {
        console.error('❌Error fetching CSRF token:', error);
    }
};
