import { createTRPCRouter } from './trpc';
import { stripeRouter } from './routers/stripe';
import { userRouter } from './routers/user';
import { widgetsRouter } from './routers/widgets';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  stripe: stripeRouter,
  user: userRouter,
  widgets: widgetsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
