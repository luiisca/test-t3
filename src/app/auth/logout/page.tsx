import Link from "next/link";

import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";

export default async function Logout() {
    const session = await getServerAuthSession();

    if (session?.user) {
        return redirect('/simulation')
    } else {
        return (
            <div>
                <div>You've logged out!</div>
                <Link href='/'>Go to home</Link>
            </div>
        )
    }
}

