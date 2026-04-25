import { router } from "../trpc";
import { meRouter } from "./me";

export const appRouter = router({
  me: meRouter,
});

export type AppRouter = typeof appRouter;
