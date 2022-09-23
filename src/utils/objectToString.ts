import { getObjectType, ObjectType } from "../enums/objectType";
import { functionToString } from "./parse";

export function objectToString(obj: unknown): string {
  const objectType = getObjectType(obj);
  switch (objectType) {
    case ObjectType.Error:
      return "Error";
    case ObjectType.Object:
      return "Object";
    case ObjectType.Array:
      return "Array";
    case ObjectType.String:
      return `"${obj as string}"`;
    case ObjectType.Number:
      return `${obj as number}`;
    case ObjectType.Boolean:
      return (obj as boolean) ? "true" : "false";
    case ObjectType.Date:
      return (obj as Date).toISOString();
    case ObjectType.Null:
      return "null";
    case ObjectType.Undefined:
      return "undefined";
    case ObjectType.Function:
      return functionToString(obj as Function);
    case ObjectType.Symbol:
      return (obj as Symbol).toString();
    default:
      return "Unknown object type";
  }
}
