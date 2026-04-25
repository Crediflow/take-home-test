import { router, userProcedure } from "../trpc";

export const meRouter = router({
  current: userProcedure.query(({ ctx }) => ({
    user: ctx.user,
    organization: ctx.organization,
  })),
});
