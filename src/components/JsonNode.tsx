/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 20/10/16
 * Licence: See Readme
 */
import React, { useMemo } from "react";
import { getObjectType, ObjectType } from "../enums/objectType";
import type { JsonProps } from "../types/JsonComponentProps";
import { functionToString } from "../utils/parse";
import JsonArray from "./JsonArray";
import JsonFunctionValue from "./JsonFunctionValue";
import JsonObject from "./JsonObject";
import JsonValue from "./JsonValue";

type Props = JsonProps;

function JsonNode({ data, name, keyPath = [], depth = 0 }: Props) {
  // == Memos ==
  const dataType = useMemo<ObjectType>(() => getObjectType(data), [data]);

  // == Render ==
  switch (dataType) {
    case ObjectType.Error:
    case ObjectType.Object:
      return (
        <JsonObject
          name={name}
          keyPath={keyPath}
          depth={depth}
          data={data}
          dataType={dataType}
          readOnly={dataType === ObjectType.Error}
        />
      );
    case ObjectType.Array:
      return (
        <JsonArray
          name={name}
          keyPath={keyPath}
          depth={depth}
          data={data}
          dataType={dataType}
        />
      );
    case ObjectType.Function:
      return (
        <JsonFunctionValue
          name={name}
          keyPath={keyPath}
          depth={depth}
          value={functionToString(data)}
          originalValue={data}
          dataType={dataType}
        />
      );
    case ObjectType.String:
    case ObjectType.Number:
    case ObjectType.Boolean:
    case ObjectType.Date:
    case ObjectType.Null:
    case ObjectType.Undefined:
    case ObjectType.Symbol:
      return (
        <JsonValue
          name={name}
          keyPath={keyPath}
          depth={depth}
          data={data}
          dataType={dataType}
          readOnly={
            dataType === ObjectType.Symbol || dataType === ObjectType.Date
          }
        />
      );
    default:
      return null;
  }
}

export default JsonNode;
