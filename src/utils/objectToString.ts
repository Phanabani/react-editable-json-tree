import { getObjectType, ObjectType } from "../enums/objectType";

export function objectToString(obj: unknown): string {
  const objectType = getObjectType(obj);
  switch (objectType) {
    case ObjectType.Error:
    case ObjectType.Object:
    case ObjectType.Array:
      return null;
    case ObjectType.String:
      return `"${obj as string}"`;
    case ObjectType.Number:
      return `${obj as number}`;
    case ObjectType.Boolean:
      return (obj as boolean) ? "true" : "false";
    case ObjectType.Date:
      return obj as Date;
  }
}
