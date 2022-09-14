/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 20/10/16
 * Licence: See Readme
 */
import PropTypes from "prop-types";
/* ************************************* */
/* ********       IMPORTS       ******** */
/* ************************************* */
import React, { Component } from "react";
import { getObjectType, ObjectType as dataTypes } from "../enums/objectType";
import type { JsonProps } from "../types/JsonComponentProps";
import type { JsonElementType } from "../types/JsonTypes";
import { functionToString } from "../utils/parse";
import JsonArray from "./JsonArray";
import JsonFunctionValue from "./JsonFunctionValue";
import JsonObject from "./JsonObject";
import JsonValue from "./JsonValue";

/* ************************************* */
/* ********      VARIABLES      ******** */
/* ************************************* */
// Prop types
const propTypes = {
  isCollapsed: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDeltaUpdate: PropTypes.func.isRequired,
  readOnly: PropTypes.func.isRequired,
  getStyle: PropTypes.func.isRequired,
  addButtonElement: PropTypes.element,
  cancelButtonElement: PropTypes.element,
  editButtonElement: PropTypes.element,
  inputElementGenerator: PropTypes.func.isRequired,
  textareaElementGenerator: PropTypes.func.isRequired,
  minusMenuElement: PropTypes.element,
  plusMenuElement: PropTypes.element,
  beforeRemoveAction: PropTypes.func,
  beforeAddAction: PropTypes.func,
  beforeUpdateAction: PropTypes.func,
  logger: PropTypes.object.isRequired,
  onSubmitValueParser: PropTypes.func.isRequired,
};

interface Props extends JsonProps<JsonElementType> {
  handleRemove?: () => void;
  handleUpdateValue?: () => void;
}

// Default props
const defaultProps = {
  keyPath: [],
  deep: 0,
};

/* ************************************* */
/* ********      COMPONENT      ******** */

/* ************************************* */
class JsonNode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      name: props.name,
      keyPath: props.keyPath,
      deep: props.deep,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.data,
    });
  }

  render() {
    const { data, name, keyPath, deep } = this.state;
    const {
      isCollapsed,
      handleRemove,
      handleUpdateValue,
      onUpdate,
      onDeltaUpdate,
      readOnly,
      getStyle,
      addButtonElement,
      cancelButtonElement,
      editButtonElement,
      inputElementGenerator,
      textareaElementGenerator,
      minusMenuElement,
      plusMenuElement,
      beforeRemoveAction,
      beforeAddAction,
      beforeUpdateAction,
      logger,
      onSubmitValueParser,
    } = this.props;
    const readOnlyTrue = () => true;

    const dataType = getObjectType(data);
    switch (dataType) {
      case dataTypes.ERROR:
        return (
          <JsonObject
            data={data}
            name={name}
            isCollapsed={isCollapsed}
            keyPath={keyPath}
            deep={deep}
            handleRemove={handleRemove}
            onUpdate={onUpdate}
            onDeltaUpdate={onDeltaUpdate}
            readOnly={readOnlyTrue}
            dataType={dataType}
            getStyle={getStyle}
            addButtonElement={addButtonElement}
            cancelButtonElement={cancelButtonElement}
            editButtonElement={editButtonElement}
            inputElementGenerator={inputElementGenerator}
            textareaElementGenerator={textareaElementGenerator}
            minusMenuElement={minusMenuElement}
            plusMenuElement={plusMenuElement}
            beforeRemoveAction={beforeRemoveAction}
            beforeAddAction={beforeAddAction}
            beforeUpdateAction={beforeUpdateAction}
            logger={logger}
            onSubmitValueParser={onSubmitValueParser}
          />
        );
      case dataTypes.OBJECT:
        return (
          <JsonObject
            data={data}
            name={name}
            isCollapsed={isCollapsed}
            keyPath={keyPath}
            deep={deep}
            handleRemove={handleRemove}
            onUpdate={onUpdate}
            onDeltaUpdate={onDeltaUpdate}
            readOnly={readOnly}
            dataType={dataType}
            getStyle={getStyle}
            addButtonElement={addButtonElement}
            cancelButtonElement={cancelButtonElement}
            editButtonElement={editButtonElement}
            inputElementGenerator={inputElementGenerator}
            textareaElementGenerator={textareaElementGenerator}
            minusMenuElement={minusMenuElement}
            plusMenuElement={plusMenuElement}
            beforeRemoveAction={beforeRemoveAction}
            beforeAddAction={beforeAddAction}
            beforeUpdateAction={beforeUpdateAction}
            logger={logger}
            onSubmitValueParser={onSubmitValueParser}
          />
        );
      case dataTypes.ARRAY:
        return (
          <JsonArray
            data={data}
            name={name}
            isCollapsed={isCollapsed}
            keyPath={keyPath}
            deep={deep}
            handleRemove={handleRemove}
            onUpdate={onUpdate}
            onDeltaUpdate={onDeltaUpdate}
            readOnly={readOnly}
            dataType={dataType}
            getStyle={getStyle}
            addButtonElement={addButtonElement}
            cancelButtonElement={cancelButtonElement}
            editButtonElement={editButtonElement}
            inputElementGenerator={inputElementGenerator}
            textareaElementGenerator={textareaElementGenerator}
            minusMenuElement={minusMenuElement}
            plusMenuElement={plusMenuElement}
            beforeRemoveAction={beforeRemoveAction}
            beforeAddAction={beforeAddAction}
            beforeUpdateAction={beforeUpdateAction}
            logger={logger}
            onSubmitValueParser={onSubmitValueParser}
          />
        );
      case dataTypes.STRING:
        return (
          <JsonValue
            name={name}
            value={`"${data}"`}
            originalValue={data}
            keyPath={keyPath}
            deep={deep}
            handleRemove={handleRemove}
            handleUpdateValue={handleUpdateValue}
            readOnly={readOnly}
            dataType={dataType}
            getStyle={getStyle}
            cancelButtonElement={cancelButtonElement}
            editButtonElement={editButtonElement}
            inputElementGenerator={inputElementGenerator}
            minusMenuElement={minusMenuElement}
            logger={logger}
            onSubmitValueParser={onSubmitValueParser}
          />
        );
      case dataTypes.NUMBER:
        return (
          <JsonValue
            name={name}
            value={data}
            originalValue={data}
            keyPath={keyPath}
            deep={deep}
            handleRemove={handleRemove}
            handleUpdateValue={handleUpdateValue}
            readOnly={readOnly}
            dataType={dataType}
            getStyle={getStyle}
            cancelButtonElement={cancelButtonElement}
            editButtonElement={editButtonElement}
            inputElementGenerator={inputElementGenerator}
            minusMenuElement={minusMenuElement}
            logger={logger}
            onSubmitValueParser={onSubmitValueParser}
          />
        );
      case dataTypes.BOOLEAN:
        return (
          <JsonValue
            name={name}
            value={data ? "true" : "false"}
            originalValue={data}
            keyPath={keyPath}
            deep={deep}
            handleRemove={handleRemove}
            handleUpdateValue={handleUpdateValue}
            readOnly={readOnly}
            dataType={dataType}
            getStyle={getStyle}
            cancelButtonElement={cancelButtonElement}
            editButtonElement={editButtonElement}
            inputElementGenerator={inputElementGenerator}
            minusMenuElement={minusMenuElement}
            logger={logger}
            onSubmitValueParser={onSubmitValueParser}
          />
        );
      case dataTypes.DATE:
        return (
          <JsonValue
            name={name}
            value={data.toISOString()}
            originalValue={data}
            keyPath={keyPath}
            deep={deep}
            handleRemove={handleRemove}
            handleUpdateValue={handleUpdateValue}
            readOnly={readOnlyTrue}
            dataType={dataType}
            getStyle={getStyle}
            cancelButtonElement={cancelButtonElement}
            editButtonElement={editButtonElement}
            inputElementGenerator={inputElementGenerator}
            minusMenuElement={minusMenuElement}
            logger={logger}
            onSubmitValueParser={onSubmitValueParser}
          />
        );
      case dataTypes.NULL:
        return (
          <JsonValue
            name={name}
            value={"null"}
            originalValue={"null"}
            keyPath={keyPath}
            deep={deep}
            handleRemove={handleRemove}
            handleUpdateValue={handleUpdateValue}
            readOnly={readOnly}
            dataType={dataType}
            getStyle={getStyle}
            cancelButtonElement={cancelButtonElement}
            editButtonElement={editButtonElement}
            inputElementGenerator={inputElementGenerator}
            minusMenuElement={minusMenuElement}
            logger={logger}
            onSubmitValueParser={onSubmitValueParser}
          />
        );
      case dataTypes.UNDEFINED:
        return (
          <JsonValue
            name={name}
            value={"undefined"}
            originalValue={"undefined"}
            keyPath={keyPath}
            deep={deep}
            handleRemove={handleRemove}
            handleUpdateValue={handleUpdateValue}
            readOnly={readOnly}
            dataType={dataType}
            getStyle={getStyle}
            cancelButtonElement={cancelButtonElement}
            editButtonElement={editButtonElement}
            inputElementGenerator={inputElementGenerator}
            minusMenuElement={minusMenuElement}
            logger={logger}
            onSubmitValueParser={onSubmitValueParser}
          />
        );
      case dataTypes.FUNCTION:
        return (
          <JsonFunctionValue
            name={name}
            value={functionToString(data)}
            originalValue={data}
            keyPath={keyPath}
            deep={deep}
            handleRemove={handleRemove}
            handleUpdateValue={handleUpdateValue}
            readOnly={readOnly}
            dataType={dataType}
            getStyle={getStyle}
            cancelButtonElement={cancelButtonElement}
            editButtonElement={editButtonElement}
            textareaElementGenerator={textareaElementGenerator}
            minusMenuElement={minusMenuElement}
            logger={logger}
            onSubmitValueParser={onSubmitValueParser}
          />
        );
      case dataTypes.SYMBOL:
        return (
          <JsonValue
            name={name}
            value={data.toString()}
            originalValue={data}
            keyPath={keyPath}
            deep={deep}
            handleRemove={handleRemove}
            handleUpdateValue={handleUpdateValue}
            readOnly={readOnlyTrue}
            dataType={dataType}
            getStyle={getStyle}
            cancelButtonElement={cancelButtonElement}
            editButtonElement={editButtonElement}
            inputElementGenerator={inputElementGenerator}
            minusMenuElement={minusMenuElement}
            logger={logger}
            onSubmitValueParser={onSubmitValueParser}
          />
        );
      default:
        return null;
    }
  }
}

// Add prop types
JsonNode.propTypes = propTypes;
// Add default props
JsonNode.defaultProps = defaultProps;

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
export default JsonNode;
