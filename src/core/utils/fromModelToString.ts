export const fromModelToString = (model: any, parentKey = ""): string => {
  if (typeof model !== "object" || model === null) return "";

  const keys: string[] = [];

  for (const key of Object.keys(model)) {
    const value = model[key];
    const currentPath = parentKey ? `${parentKey}.${key}` : key;

    if (value === true) {
      keys.push(currentPath);
    } else if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === "object") {
        const nested = fromModelToString(value[0], currentPath);
        if (nested) keys.push(nested);
      }
    } else if (typeof value === "object" && value !== null) {
      const nested = fromModelToString(value, currentPath);
      if (nested) keys.push(nested);
    }
  }

  return keys.join(",");
};
