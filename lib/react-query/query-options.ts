import { DefaultOptions } from "@tanstack/react-query";

export const queryOptions: DefaultOptions = {
  queries: {
    staleTime: 1000 * 60 * 5,

    gcTime: 1000 * 60 * 30,

    retry: 1,

    refetchOnWindowFocus: false,

    refetchOnReconnect: true,

    refetchOnMount: true,
  },

  mutations: {
    retry: 0,
  },
};