export const filterByName = (value: any, filter: any) => {
  if (Array.isArray(filter) && filter.length === 0) return true;

  console.log({
    value,
    filter,
  });

  return Array.isArray(filter)
    ? filter.some(
        (item) => item?.name?.toLowerCase() === value?.name?.toLowerCase()
      )
    : false;
};
