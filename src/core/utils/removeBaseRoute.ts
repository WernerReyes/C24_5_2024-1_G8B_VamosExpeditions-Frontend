export const removeBaseRoute = <
  T extends { [key: string | number | symbol]: string }
>(
  routes: T,
  baseUrl: string
): T => {
  const newRoutes = { ...routes };
  Object.keys(newRoutes).forEach((key) => {
    newRoutes[key as keyof T] = newRoutes[key].replace(
      baseUrl,
      ""
    ) as T[keyof T];
  });
  return newRoutes;
};
