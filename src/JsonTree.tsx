/*
 * Author: Alexandre Havrileck (Oxyno-zeta), Phanabani
 * Date: 13/10/16
 * Licence: See Readme
 */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import JsonNode from "./components/JsonNode";
import * as styles from "./constants/styles";
import { DeltaType } from "./enums/deltaType";
import { InputUsageType } from "./enums/inputUsageType";
import { getObjectType, ObjectType } from "./enums/objectType";
import type {
  Data,
  Depth,
  KeyName,
  KeyPath,
  TreeArgs,
  TreeStyles,
  ValueParser,
} from "./types/JsonTree";
import parse from "./utils/parse";

// TODO rename this. input usage doesn't make sense
type TreeArgsWithInput = TreeArgs & { inputUsageType: InputUsageType };

type Factory<Args, Value> = (args: Args) => Value;
type MaybeFactory<Args, Value> = Value | Factory<Args, Value>;
type MaybeInputElementFactory = MaybeFactory<TreeArgsWithInput, JSX.Element>;

type Action<T> = (
  args: Omit<TreeArgs, "dataType" | "data"> & T
) => Promise<void>;

interface Props {
  data: Data;

  rootName?: string;
  isCollapsed?: (args: { keyPath: KeyPath; depth: Depth }) => boolean;
  onFullyUpdate?: (args: { data: Data }) => void;
  onDeltaUpdate?: (args: TreeArgs & { oldValue: Data; newValue: Data }) => void;
  readOnly?: MaybeFactory<TreeArgs, boolean>;
  getStyle?: (args: TreeArgs) => TreeStyles;
  onSubmitValueParser?: ValueParser;
  allowFunctionEvaluation: boolean;

  addButtonElement?: JSX.Element;
  cancelButtonElement?: JSX.Element;
  editButtonElement?: JSX.Element;
  inputElement?: MaybeInputElementFactory;
  textareaElement?: MaybeInputElementFactory;
  minusMenuElement?: JSX.Element;
  plusMenuElement?: JSX.Element;

  beforeRemoveAction?: Action<{ oldValue: Data }>;
  beforeAddAction?: Action<{ newValue: Data }>;
  beforeUpdateAction?: Action<{ oldValue: Data; newValue: Data }>;

  logger?: { error: () => void };
}

const createParsingFunction =
  (allowFunctionEvaluation: boolean): ValueParser =>
  ({ rawValue }) =>
    parse(rawValue, allowFunctionEvaluation);

function JsonTree({
  data: propsData,

  rootName: propsRootName = "root",
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
  allowFunctionEvaluation,

  addButtonElement,
  cancelButtonElement,
  editButtonElement,
  inputElement = <input />,
  textareaElement = <textarea />,
  minusMenuElement,
  plusMenuElement,

  beforeRemoveAction,
  beforeAddAction,
  beforeUpdateAction,

  logger,
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
    Factory<TreeArgsWithInput, React.ReactNode>
  >(() => {
    if (typeof inputElement === "function") {
      return inputElement;
    }
    return () => inputElement;
  }, [inputElement]);

  const textareaElementFunction = useMemo<
    Factory<TreeArgsWithInput, React.ReactNode>
  >(() => {
    if (typeof textareaElement === "function") {
      return textareaElement;
    }
    return () => textareaElement;
  }, [textareaElement]);

  // == Render ==
  let node: React.ReactNode;
  if (dataType === ObjectType.Object || dataType === ObjectType.Array) {
    node = (
      <JsonNode
        data={data}
        name={rootName}
        collapsed={false}
        deep={-1}
        isCollapsed={isCollapsed}
        onUpdate={onUpdate}
        onDeltaUpdate={onDeltaUpdate}
        readOnly={readOnlyFunction}
        getStyle={getStyle}
        addButtonElement={addButtonElement}
        cancelButtonElement={cancelButtonElement}
        editButtonElement={editButtonElement}
        inputElementGenerator={inputElementFunction}
        textareaElementGenerator={textareaElementFunction}
        minusMenuElement={minusMenuElement}
        plusMenuElement={plusMenuElement}
        beforeRemoveAction={beforeRemoveAction}
        beforeAddAction={beforeAddAction}
        beforeUpdateAction={beforeUpdateAction}
        logger={logger}
        onSubmitValueParser={onSubmitValueParser}
      />
    );
  } else {
    node = "Data must be an Array or Object";
  }

  return <div className="rejt-tree">{node}</div>;
}

export { JsonTree, DeltaType, ObjectType, InputUsageType };
