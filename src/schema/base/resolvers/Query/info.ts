import type { QueryResolvers } from "./../../../types.generated";

export const info: NonNullable<QueryResolvers["info"]> = () => { 
  return "Die Kochbuch-API";
};