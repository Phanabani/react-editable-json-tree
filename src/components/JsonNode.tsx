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
      return (
        <JsonObject
          name={name}
          keyPath={keyPath}
          depth={depth}
          data={data}
          dataType={dataType}
          readOnly
        />
      );
    case ObjectType.Object:
      return (
        <JsonObject
          name={name}
          keyPath={keyPath}
          depth={depth}
          data={data}
          dataType={dataType}
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
    case ObjectType.String:
      return (
        <JsonValue
          name={name}
          keyPath={keyPath}
          depth={depth}
          value={`"${data}"`}
          originalValue={data}
          dataType={dataType}
        />
      );
    case ObjectType.Number:
      return (
        <JsonValue
          name={name}
          keyPath={keyPath}
          depth={depth}
          value={data}
          originalValue={data}
          dataType={dataType}
        />
      );
    case ObjectType.Boolean:
      return (
        <JsonValue
          name={name}
          keyPath={keyPath}
          depth={depth}
          value={data ? "true" : "false"}
          originalValue={data}
          dataType={dataType}
        />
      );
    case ObjectType.Date:
      return (
        <JsonValue
          name={name}
          keyPath={keyPath}
          depth={depth}
          value={data.toISOString()}
          originalValue={data}
          dataType={dataType}
          readOnly
        />
      );
    case ObjectType.Null:
      return (
        <JsonValue
          name={name}
          keyPath={keyPath}
          depth={depth}
          value="null"
          originalValue="null"
          dataType={dataType}
        />
      );
    case ObjectType.Undefined:
      return (
        <JsonValue
          name={name}
          keyPath={keyPath}
          depth={depth}
          value="undefined"
          originalValue="undefined"
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
    case ObjectType.Symbol:
      return (
        <JsonValue
          name={name}
          keyPath={keyPath}
          depth={depth}
          value={data.toString()}
          originalValue={data}
          dataType={dataType}
          readOnly
        />
      );
    default:
      return null;
  }
}

export default JsonNode;
