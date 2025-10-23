import {fetchRequestHandler} from '@trpc/server/adapters/fetch';
import {appRouter} from '../../../../src/routers/routers';

export const handler = (request: Request): Promise<Response> => {
  return fetchRequestHandler({
    endpoint: '/api/trpc/getData',
    req: request,
    router: appRouter,
    createContext: () => ({}),
  });
}



export {handler as GET, handler as POST};