import {
  QueryClient,
  type DefaultOptions,
  type DehydratedState,
} from "@tanstack/react-query";
import { hydrate, dehydrate } from "@tanstack/react-query";
import { AxiosError } from "axios";

export interface AppRouterDehydratedState {
  queryClientState: DehydratedState;
}

const defaultOptions: DefaultOptions = {
  queries: {
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: (failureCount, error: unknown) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          return false;
        }
      }

      return failureCount < 3;
    },
  },
};

export function createAppQueryClient() {
  return new QueryClient({
    defaultOptions,
  });
}

export function dehydrateAppQueryClient(
  queryClient: QueryClient,
): AppRouterDehydratedState {
  return {
    queryClientState: dehydrate(queryClient),
  };
}

export async function hydrateAppQueryClient(
  queryClient: QueryClient,
  dehydrated?: AppRouterDehydratedState,
) {
  if (!dehydrated?.queryClientState) {
    return;
  }

  hydrate(queryClient, dehydrated.queryClientState);
}
