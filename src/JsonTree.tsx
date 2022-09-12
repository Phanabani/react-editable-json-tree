/*
 * Author: Alexandre Havrileck (Oxyno-zeta), Phanabani
 * Date: 13/10/16
 * Licence: See Readme
 */
import React, { Component } from "react";
import JsonNode from "./components/JsonNode";
import { DeltaType } from "./enums/deltaType";
import { InputUsageType } from "./enums/inputUsageType";
import { getObjectType, ObjectType } from "./enums/objectType";
import type { Data, Depth, KeyPath, TreeArgs } from "./types/JsonTree";
import parse from "./utils/parse";
import { array, object, value } from "./utils/styles";

type MaybeFactory<Value, Args> = Value | ((args: Args) => Value);

type MaybeElementFactory = MaybeFactory<
  JSX.Element,
  TreeArgs & { inputUsageType: InputUsageType }
>;

type Action<T> = (
  args: Omit<TreeArgs, "dataType" | "data"> & T
) => Promise<void>;

interface Props {
  data: Data;
  rootName?: string;

  isCollapsed?: (args: { keyPath: KeyPath; depth: Depth }) => boolean;
  onFullyUpdate?: (args: { data: Data }) => void;
  onDeltaUpdate?: (args: TreeArgs & { oldValue: Data; newValue: Data }) => void;
  readOnly?: MaybeFactory<boolean, TreeArgs>;
  getStyle?: (args: TreeArgs) => React.CSSProperties;
  onSubmitValueParser?: (
    args: Omit<TreeArgs, "data" | "dataType"> & {
      isEditMode: boolean;
      rawValue: string;
    }
  ) => Data;

  addButtonElement?: JSX.Element;
  cancelButtonElement?: JSX.Element;
  editButtonElement?: JSX.Element;
  inputElement?: MaybeElementFactory;
  textareaElement?: MaybeElementFactory;
  minusMenuElement?: JSX.Element;
  plusMenuElement?: JSX.Element;

  beforeRemoveAction?: Action<{ oldValue: Data }>;
  beforeAddAction?: Action<{ newValue: Data }>;
  beforeUpdateAction?: Action<{ oldValue: Data; newValue: Data }>;

  logger?: { error: () => void };
}
// Default props
const defaultProps = {
  rootName: "root",
  isCollapsed: (keyPath, deep) => deep !== -1,
  getStyle: (keyName, data, keyPath, deep, dataType) => {
    switch (dataType) {
      case "Object":
      case "Error":
        return object;
      case "Array":
        return array;
      default:
        return value;
    }
  },
  /* eslint-disable no-unused-vars */
  readOnly: (keyName, data, keyPath, deep, dataType) => false,
  onFullyUpdate: (data) => {},
  onDeltaUpdate: ({ type, keyPath, deep, key, newValue, oldValue }) => {},
  beforeRemoveAction: (key, keyPath, deep, oldValue) =>
    new Promise((resolve) => resolve()),
  beforeAddAction: (key, keyPath, deep, newValue) =>
    new Promise((resolve) => resolve()),
  beforeUpdateAction: (key, keyPath, deep, oldValue, newValue) =>
    new Promise((resolve) => resolve()),
  logger: { error: () => {} },
  onSubmitValueParser: (isEditMode, keyPath, deep, name, rawValue) =>
    parse(rawValue),
  inputElement: (usage, keyPath, deep, keyName, data, dataType) => <input />,
  textareaElement: (usage, keyPath, deep, keyName, data, dataType) => (
    <textarea />
  ),
  /* eslint-enable */
};

/* ************************************* */
/* ********      COMPONENT      ******** */
/* ************************************* */
class JsonTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      rootName: props.rootName,
    };
    // Bind
    this.onUpdate = this.onUpdate.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.data,
      rootName: nextProps.rootName,
    });
  }

  onUpdate(key, data) {
    this.setState({
      data,
    });
    // Call on fully update
    const { onFullyUpdate } = this.props;
    onFullyUpdate(data);
  }

  render() {
    const { data, rootName } = this.state;
    const {
      isCollapsed,
      onDeltaUpdate,
      readOnly,
      getStyle,
      addButtonElement,
      cancelButtonElement,
      editButtonElement,
      inputElement,
      textareaElement,
      minusMenuElement,
      plusMenuElement,
      beforeRemoveAction,
      beforeAddAction,
      beforeUpdateAction,
      logger,
      onSubmitValueParser,
    } = this.props;

    // Node type
    const dataType = getObjectType(data);
    let node = null;
    let readOnlyFunction = readOnly;
    if (getObjectType(readOnly) === "Boolean") {
      readOnlyFunction = () => readOnly;
    }
    let inputElementFunction = inputElement;
    if (inputElement && getObjectType(inputElement) !== "Function") {
      inputElementFunction = () => inputElement;
    }
    let textareaElementFunction = textareaElement;
    if (textareaElement && getObjectType(textareaElement) !== "Function") {
      textareaElementFunction = () => textareaElement;
    }

    if (dataType === "Object" || dataType === "Array") {
      node = (
        <JsonNode
          data={data}
          name={rootName}
          collapsed={false}
          deep={-1}
          isCollapsed={isCollapsed}
          onUpdate={this.onUpdate}
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
}

// Add prop types
JsonTree.propTypes = propTypes;
// Add default props
JsonTree.defaultProps = defaultProps;

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
export { JsonTree, DeltaType, ObjectType, InputUsageType };
