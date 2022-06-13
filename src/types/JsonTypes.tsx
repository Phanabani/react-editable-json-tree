export type JsonSimpleElementType = null | boolean | number | string;
export type JsonArrayType = JsonElementType[];
export type JsonObjectType = { [key: string]: JsonElementType };
export type JsonElementType =
  | JsonSimpleElementType
  | JsonArrayType
  | JsonObjectType;
