import { QueryClient } from "@tanstack/react-query";
import { queryOptions } from "./query-options";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: queryOptions,
  });
}