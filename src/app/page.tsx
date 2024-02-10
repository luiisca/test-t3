import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { env } from "~/env";
import { redirect } from "next/navigation";

export default async function Home({ searchParams }: { searchParams: { inflation: string } }) {
    noStore();
    const hello = await api.post.hello.query({ text: "hello" });
    const session = await getServerAuthSession();

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
            <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
                    Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
                </h1>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
                    <Link
                        className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
                        href="https://create.t3.gg/en/usage/first-steps"
                        target="_blank"
                    >
                        <h3 className="text-2xl font-bold">First Steps →</h3>
                        <div className="text-lg">
                            Just the basics - Everything you need to know to set up your
                            database and authentication.
                        </div>
                    </Link>
                    <Link
                        className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
                        href="https://create.t3.gg/en/introduction"
                        target="_blank"
                    >
                        <h3 className="text-2xl font-bold">Documentation →</h3>
                        <div className="text-lg">
                            Learn more about Create T3 App, the libraries it uses, and how to
                            deploy it.
                        </div>
                    </Link>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <p className="text-2xl text-white">
                        {hello ? hello.greeting : "Loading tRPC query..."}
                    </p>

                    <div className="flex flex-col items-center justify-center gap-4">
                        <p className="text-center text-2xl text-white">
                            {session && <span>Logged in as {session.user?.name}</span>}
                        </p>
                        {session?.user && <Link href='/simulation'>Go to App</Link>}
                        {!session?.user && <Link href='/auth/login'>Login</Link>}
                    </div>
                </div>

                <Inflation value={searchParams.inflation} />
                {/* <CrudShowcase /> */}
            </div>
        </main>
    );
}

async function CrudShowcase() {
    const session = await getServerAuthSession();
    if (!session?.user) return null;

    const latestPost = await api.post.getLatest.query();

    return (
        <div className="w-full max-w-xs">
            {latestPost ? (
                <p className="truncate">Your most recent post: {latestPost.name}</p>
            ) : (
                <p>You have no posts yet.</p>
            )}

            <CreatePost />
        </div>
    );
}

async function fetchInflationRate(country: string) {
    const apiUrl = `https://www.statbureau.org/calculate-inflation-rate-json`;
    try {

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                country,
                start: '2018/1/1', // Start of the current year
                end: '2018/12/1', // End of the current year
            }),
        });
        const data = await response.json();
        console.log(`INFLATION DATA 💰 for ${country}: `, data)
    } catch (e) {
        console.log('INFLATION error ❌', e)
    }
}

async function test(country: string) {
    let value = [] as Array<
        Record<string, string> & {
            yearly_rate_pct: string;
            error?: string;
        }
    >;
    try {
        const result = await fetch(
            `https://api.api-ninjas.com/v1/inflation?country=${country}`,
            {
                method: "GET",
                headers: {
                    "X-Api-Key": env.NINJA_API_KEY || "",
                    "Content-Type": "application/json",
                },
            }
        );
        value = await result.json();
        if (('error' in value)) {
            console.log('ERROR mssg ❌', value)
            return {
                error: value.error
            }
        } else {
            console.log('RATE ✅', value)
            return {
                yearlyInflation: value[0]?.yearly_rate_pct
            }
        }
    } catch (e) {
        console.log('ERROR ❌', e)
        return {
            error: e,
        }
    }
}
async function Inflation({ value }: { value: string }) {
    const session = await getServerAuthSession();
    if (!session?.user) return null;

    async function getInflation(formData: FormData) {
        "use server"

        const country = formData.get('country') as string
        const result = await fetchInflationRate(country);
        // if ('error' in result) {
        //     redirect(`?error=${result.error}`)
        // } else {
        //     redirect(`?inflation=${result.yearlyInflation}`)
        // }

    }

    return (
        <div>
            <p>Inflation: {value}</p>
            <form action={getInflation}>
                <input type="text" name="country" className="text-red-500" />
                <button type="submit">Get country!</button>
            </form>
        </div>
    )
}
