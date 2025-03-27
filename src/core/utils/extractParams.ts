import { regex } from "../constants";

const { QUERY_KEY } = regex;

export const extractParams = <T>(cachedQueries: Record<string, unknown>): T => {
  const extractedParams = Object.keys(cachedQueries)
    .map((queryKey) => {
      const match = queryKey.match(QUERY_KEY);

      if (match) {
        const queryName = match[1];
        const params = JSON.parse(match[2]);

        return { [queryName]: params };
      }

      return null;
    })
    .filter(Boolean);

  return extractedParams as T;
};
