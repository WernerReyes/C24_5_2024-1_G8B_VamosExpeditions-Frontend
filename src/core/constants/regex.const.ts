export const regex = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PASSWORD: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
  PHONE: /^\+\d{6,30}$/,
  QUERY_KEY: /^(.+?)\((\{.*\})\)$/,
};
