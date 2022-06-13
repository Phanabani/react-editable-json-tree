/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 18/10/16
 * Licence: See Readme
 */
/* ************************************* */
/* ********       IMPORTS       ******** */
/* ************************************* */
import PropTypes from "prop-types";
import React, { Component } from "react";
import { HotKeys } from "react-hotkeys";
import { ObjectType } from "../enums/objectType";
import type { BaseJsonComponentProps } from "../types/BaseJsonComponentProps";
import inputUsageTypes from "../types/inputUsageTypes";
import type { JsonSimpleElementType } from "../types/JsonTypes";
import { isComponentWillChange } from "../utils/objectTypes";

/* ************************************* */
/* ********      VARIABLES      ******** */
/* ************************************* */
// Prop types
const propTypes = {
  readOnly: PropTypes.func.isRequired,
  getStyle: PropTypes.func.isRequired,
  editButtonElement: PropTypes.element,
  cancelButtonElement: PropTypes.element,
  inputElementGenerator: PropTypes.func.isRequired,
  minusMenuElement: PropTypes.element,
  logger: PropTypes.object.isRequired,
  onSubmitValueParser: PropTypes.func.isRequired,
};

interface Props extends BaseJsonComponentProps {
  name: string;
  value: JsonSimpleElementType;
  originalValue?: JsonSimpleElementType;
  handleRemove?: () => void;
  handleUpdateValue?: () => void;
  dataType?: ObjectType;
}

// Default props
const defaultProps = {
  keyPath: [],
  deep: 0,
  handleUpdateValue: () => Promise.resolve(),
  editButtonElement: <button>e</button>,
  cancelButtonElement: <button>c</button>,
  minusMenuElement: <span> - </span>,
};

/* ************************************* */
/* ********      COMPONENT      ******** */

/* ************************************* */
class JsonValue extends Component {
  constructor(props) {
    super(props);
    const keyPath = [...props.keyPath, props.name];
    this.state = {
      value: props.value,
      name: props.name,
      keyPath,
      deep: props.deep,
      editEnabled: false,
      inputRef: null,
    };

    // Bind
    this.handleEditMode = this.handleEditMode.bind(this);
    this.refInput = this.refInput.bind(this);
    this.handleCancelEdit = this.handleCancelEdit.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value,
    });
  }

  componentDidUpdate() {
    const { editEnabled, inputRef, name, value, keyPath, deep } = this.state;
    const { readOnly, dataType } = this.props;
    const readOnlyResult = readOnly(name, value, keyPath, deep, dataType);

    if (
      editEnabled &&
      !readOnlyResult &&
      typeof inputRef.focus === "function"
    ) {
      inputRef.focus();
    }
  }

  handleEdit() {
    const {
      handleUpdateValue,
      originalValue,
      logger,
      onSubmitValueParser,
      keyPath,
    } = this.props;
    const { inputRef, name, deep } = this.state;

    const newValue = onSubmitValueParser(
      true,
      keyPath,
      deep,
      name,
      inputRef.value
    );

    const result = {
      value: newValue,
      key: name,
    };

    // Run update
    handleUpdateValue(result)
      .then(() => {
        // Cancel edit mode if necessary
        if (!isComponentWillChange(originalValue, newValue)) {
          this.handleCancelEdit();
        }
      })
      .catch(logger.error);
  }

  handleEditMode() {
    this.setState({
      editEnabled: true,
    });
  }

  refInput(node) {
    this.state.inputRef = node;
  }

  handleCancelEdit() {
    this.setState({
      editEnabled: false,
    });
  }

  render() {
    const { name, value, editEnabled, keyPath, deep } = this.state;
    const {
      handleRemove,
      originalValue,
      readOnly,
      dataType,
      getStyle,
      editButtonElement,
      cancelButtonElement,
      inputElementGenerator,
      minusMenuElement,
      keyPath: comeFromKeyPath,
    } = this.props;

    const style = getStyle(name, originalValue, keyPath, deep, dataType);
    let result = null;
    let minusElement = null;
    const readOnlyResult = readOnly(
      name,
      originalValue,
      keyPath,
      deep,
      dataType
    );

    if (editEnabled && !readOnlyResult) {
      const inputElement = inputElementGenerator(
        inputUsageTypes.VALUE,
        comeFromKeyPath,
        deep,
        name,
        originalValue,
        dataType
      );

      const editButtonElementLayout = React.cloneElement(editButtonElement, {
        onClick: this.handleEdit,
      });
      const cancelButtonElementLayout = React.cloneElement(
        cancelButtonElement,
        {
          onClick: this.handleCancelEdit,
        }
      );
      const inputElementLayout = React.cloneElement(inputElement, {
        ref: this.refInput,
        defaultValue: originalValue,
      });

      result = (
        <span className="rejt-edit-form" style={style.editForm}>
          {inputElementLayout} {cancelButtonElementLayout}
          {editButtonElementLayout}
        </span>
      );
      minusElement = null;
    } else {
      /* eslint-disable jsx-a11y/no-static-element-interactions */
      result = (
        <span
          className="rejt-value"
          style={style.value}
          onClick={readOnlyResult ? null : this.handleEditMode}
        >
          {value}
        </span>
      );
      /* eslint-enable */
      const minusMenuLayout = React.cloneElement(minusMenuElement, {
        onClick: handleRemove,
        className: "rejt-minus-menu",
        style: style.minus,
      });
      minusElement = readOnlyResult ? null : minusMenuLayout;
    }

    const handlers = {
      esc: this.handleCancelEdit,
      enter: this.handleEdit,
    };

    return (
      <HotKeys
        className="rejt-value-node"
        component={"li"}
        style={style.li}
        handlers={handlers}
      >
        <span className="rejt-name" style={style.name}>
          {name} :{" "}
        </span>
        {result}
        {minusElement}
      </HotKeys>
    );
  }
}

// Add prop types
JsonValue.propTypes = propTypes;
// Add default props
JsonValue.defaultProps = defaultProps;

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
export default JsonValue;
