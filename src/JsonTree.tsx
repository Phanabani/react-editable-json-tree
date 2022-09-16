/*
 * Author: Alexandre Havrileck (Oxyno-zeta), Phanabani
 * Date: 13/10/16
 * Licence: See Readme
 */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import JsonNode from "./components/JsonNode";
import * as styles from "./constants/styles";
import type {
  JsonTreeContextType,
  TreeArgsWithJsonFieldType,
} from "./contexts/jsonTreeContextType";
import { JsonTreeContext } from "./contexts/jsonTreeContextType";
import { DeltaType } from "./enums/deltaType";
import { JsonFieldType } from "./enums/jsonFieldType";
import { getObjectType, ObjectType } from "./enums/objectType";
import type { Data, TreeArgs, ValueParser } from "./types/JsonTree";
import type { Factory } from "./types/misc";
import parse from "./utils/parse";

interface Props extends JsonTreeContextType {
  data: Data;
  rootName?: string;
  allowFunctionEvaluation: boolean;
}

const createParsingFunction =
  (allowFunctionEvaluation: boolean): ValueParser =>
  ({ rawValue }) =>
    parse(rawValue, allowFunctionEvaluation);

function JsonTree({
  data: propsData,
  rootName: propsRootName = "root",
  allowFunctionEvaluation,

  isCollapsed = ({ depth }) => depth !== -1,
  onFullyUpdate,
  onDeltaUpdate,
  readOnly = false,
  getStyle = ({ dataType }) => {
    switch (dataType) {
      case ObjectType.Object:
      case ObjectType.Error:
        return styles.object;
      case ObjectType.Array:
        return styles.array;
      default:
        return styles.value;
    }
  },
  onSubmitValueParser: propOnSubmitValueParser,

  beforeRemoveAction,
  beforeAddAction,
  beforeUpdateAction,

  logger,

  addButtonElement,
  cancelButtonElement,
  editButtonElement,
  inputElement = <input />,
  textareaElement = <textarea />,
  minusMenuElement,
  plusMenuElement,
}: Props) {
  // == State ==
  const [data, setData] = useState<Data>(propsData);
  const [rootName, setRootName] = useState<string | undefined>(propsRootName);
  const [onSubmitValueParser, setOnSubmitValueParser] = useState<ValueParser>(
    propOnSubmitValueParser ?? createParsingFunction(allowFunctionEvaluation)
  );
  const [isOnSubmitValueParserOurs, setIsOnSubmitValueParserOurs] =
    useState<boolean>(propOnSubmitValueParser !== undefined);

  // == Effects ==
  useEffect(() => {
    setData(propsData);
    setRootName(propsRootName);
  }, [propsData, propsRootName]);

  // Set parsing function if it's supplied in props
  useEffect(() => {
    if (propOnSubmitValueParser) {
      setOnSubmitValueParser(propOnSubmitValueParser);
      setIsOnSubmitValueParserOurs(false);
    } else {
      setIsOnSubmitValueParserOurs(true);
    }
  }, [propOnSubmitValueParser]);

  // Create parsing function if it's not supplied in props
  useEffect(() => {
    if (!isOnSubmitValueParserOurs) return;
    setOnSubmitValueParser(createParsingFunction(allowFunctionEvaluation));
  }, [allowFunctionEvaluation, isOnSubmitValueParserOurs]);

  // == Callbacks ==
  const onUpdate = useCallback(
    (keyName: KeyName, data_: Data) => {
      setData(data_);
      onFullyUpdate?.({ data: data_ });
    },
    [onFullyUpdate]
  );

  // == Memos ==
  const dataType = useMemo<ObjectType>(() => getObjectType(data), [data]);

  const readOnlyFunction = useMemo<(args: TreeArgs) => boolean>(() => {
    if (typeof readOnly === "function") {
      return readOnly;
    }
    return () => readOnly ?? false;
  }, [readOnly]);

  const inputElementFunction = useMemo<
    Factory<TreeArgsWithJsonFieldType, React.ReactNode>
  >(() => {
    if (typeof inputElement === "function") {
      return inputElement;
    }
    return () => inputElement;
  }, [inputElement]);

  const textareaElementFunction = useMemo<
    Factory<TreeArgsWithJsonFieldType, React.ReactNode>
  >(() => {
    if (typeof textareaElement === "function") {
      return textareaElement;
    }
    return () => textareaElement;
  }, [textareaElement]);

  const contextValue = useMemo<JsonTreeContextType>(
    () => ({
      isCollapsed,
      onFullyUpdate: onUpdate,
      onDeltaUpdate,
      readOnly: readOnlyFunction,
      getStyle,
      onSubmitValueParser,

      beforeRemoveAction,
      beforeAddAction,
      beforeUpdateAction,

      logger,

      addButtonElement,
      cancelButtonElement,
      editButtonElement,
      inputElement: inputElementFunction,
      textareaElement: textareaElementFunction,
      minusMenuElement,
      plusMenuElement,
    }),
    [
      addButtonElement,
      beforeAddAction,
      beforeRemoveAction,
      beforeUpdateAction,
      cancelButtonElement,
      editButtonElement,
      getStyle,
      inputElementFunction,
      isCollapsed,
      logger,
      minusMenuElement,
      onDeltaUpdate,
      onSubmitValueParser,
      onUpdate,
      plusMenuElement,
      readOnlyFunction,
      textareaElementFunction,
    ]
  );

  // == Render ==
  let node: React.ReactNode;
  if (dataType === ObjectType.Object || dataType === ObjectType.Array) {
    node = <JsonNode data={data} name={rootName} collapsed={false} deep={-1} />;
  } else {
    node = "Data must be an Array or Object";
  }

  return (
    <div className="rejt-tree">
      <JsonTreeContext.Provider value={contextValue}>
        {node}
      </JsonTreeContext.Provider>
    </div>
  );
}

export { JsonTree, DeltaType, ObjectType, JsonFieldType };
