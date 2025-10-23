import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
// adjust this relative path if your router is located elsewhere under src
import { appRouter } from "../../../../src/routers/routers";

export const handler = (request: Request): Promise<Response> => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: () => ({}),
  });
};

export { handler as GET, handler as POST };