import Link from "next/link";

export default async function Logout() {
    return (
        <div>
            <div>You have logged out!</div>
            <Link href='/'>Go to home</Link>
        </div>
    )
}

