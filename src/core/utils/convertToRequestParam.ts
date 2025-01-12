interface IndexableType {
  [key: string]: any;
}
export const convertToRequestParam = (object: IndexableType): string => {
  if (object === null || object === undefined) return "";
  if (Object.keys(object).length === 0) return "";
  return Object.keys(object)
    .map((key) => {
      if (object[key] === null || object[key] === undefined) return "";
      return `${key}=${object[key]}`;
    })
    .filter((item) => item !== "")
    .join("&");
};

export const convertSimpleArrayToRequestParam = (
  array: any[] | null,
  key: string,
): string => {
  if (array === null || array === undefined) return "";
  if (array.length === 0) return "";
  return array
    .map((item) => {
      return `${key}=${item}`;
    })
    .join("&");
};

export const convertArrayToRequestParam = (
  array: { [key: string]: any }[] | null,
  key: string,
): string => {
  if (array === null || array === undefined) return "";
  if (array.length === 0) return "";
  return array
    .map((item) => {
      if (key in item && item[key] !== null && item[key] !== undefined) {
        return `${key}=${item[key]}`;
      } else {
        return "";
      }
    })
    .filter((item) => item !== "")
    .join("&");
};

export const concatRequestParams = (params: string[]): string => {
  return "?" + params.filter((param) => param !== "").join("&");
};
