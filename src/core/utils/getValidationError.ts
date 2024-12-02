type TypeWithKey<T> = { [key: string]: T };
export const getValidationError = (errorCode: any) => {
  const codeMatcher: TypeWithKey<string> = {
    ERR_NETWORK: "Ha ocurrido un error de red, por favor intenta de nuevo.",
    ERR_USER_INVALID_TOKEN: "Token inválido",
    ERR_USER_EXPIRED_TOKEN: "Token expirado",
  
  };

  return codeMatcher[errorCode];
};
