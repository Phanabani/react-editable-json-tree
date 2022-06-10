export enum ObjectType {
  UNDEFINED,
  NULL,
  BOOLEAN,
  NUMBER,
  BIGINT,
  STRING,
  SYMBOL,
  FUNCTION,
  OBJECT,
  // Extras
  ARRAY,
  ITERABLE,
  ERROR,
  UNKNOWN,
}

const typeMap = {
  undefined: ObjectType.UNDEFINED,
  // typeof null === "object"; you need to explicitly check for null
  boolean: ObjectType.BOOLEAN,
  number: ObjectType.NUMBER,
  bigint: ObjectType.BIGINT,
  string: ObjectType.STRING,
  symbol: ObjectType.SYMBOL,
  function: ObjectType.FUNCTION,
  object: ObjectType.OBJECT,
};

function isObject(obj: unknown): obj is object {
  return typeof obj === "object";
}

/**
 * Get an object's type as an {@link ObjectType} enum.
 * @param obj - an object
 * @returns {@param obj}'s type
 */
export function getObjectType(obj: unknown): ObjectType {
  if (!isObject(obj)) {
    const type = typeMap[typeof obj];
    if (type !== ObjectType.OBJECT) return type;
    return ObjectType.UNKNOWN;
  }

  // Handle special objects
  if (obj === null) return ObjectType.NULL; // typeof null === "object"
  if (obj.constructor === Error) return ObjectType.ERROR;
  if (Array.isArray(obj)) return ObjectType.ARRAY;
  if (typeof (obj as any)[Symbol.iterator] === "function") {
    return ObjectType.ITERABLE;
  }

  // If none of the above passed, it's just a regular object as far as we care
  return ObjectType.OBJECT;
}
