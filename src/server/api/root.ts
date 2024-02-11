import { postRouter } from "~/server/api/routers/post";
// import { externalRouter } from "~/server/api/routers/externalRouter";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    post: postRouter,
    // external: externalRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
