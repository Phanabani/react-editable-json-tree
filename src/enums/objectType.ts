export enum ObjectType {
  Undefined,
  Null,
  Boolean,
  Number,
  Bigint,
  String,
  Symbol,
  Function,
  Object,
  // Extras
  Array,
  Iterable,
  Error,
  Unknown,
}

const typeMap = {
  undefined: ObjectType.Undefined,
  // typeof null === "object"; you need to explicitly check for null
  boolean: ObjectType.Boolean,
  number: ObjectType.Number,
  bigint: ObjectType.Bigint,
  string: ObjectType.String,
  symbol: ObjectType.Symbol,
  function: ObjectType.Function,
  object: ObjectType.Object,
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
    if (type !== ObjectType.Object) return type;
    return ObjectType.Unknown;
  }

  // Handle special objects
  if (obj === null) return ObjectType.Null; // typeof null === "object"
  if (obj.constructor === Error) return ObjectType.Error;
  if (Array.isArray(obj)) return ObjectType.Array;
  if (typeof (obj as any)[Symbol.iterator] === "function") {
    return ObjectType.Iterable;
  }

  // If none of the above passed, it's just a regular object as far as we care
  return ObjectType.Object;
}
