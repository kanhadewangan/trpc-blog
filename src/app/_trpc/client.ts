import {  createTRPCReact, CreateTRPCReact } from "@trpc/react-query";
import {type AppRouter} from '../../src/routers/routers';

export const trpc = createTRPCReact<AppRouter>({});