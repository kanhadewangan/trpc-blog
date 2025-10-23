"use client";
import {trpc}  from "./client";
import { QueryClient,QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";





export default function TRPCProvider({children}: {children: React.ReactNode}) {
    const queryClient = new QueryClient();
    const trpcClient = trpc.createClient({
        links: [
            httpBatchLink({
                url: '/api/trpc',
            }),
        ],
    });

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </trpc.Provider>
    );
}

