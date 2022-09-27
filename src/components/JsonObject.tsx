/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 18/10/16
 * Licence: See Readme
 */
import PropTypes from "prop-types";
import React, { Component, useMemo, useState } from "react";
import {
 DeltaType} from "../enums/deltaType";
import { getObjectType, ObjectType } from "../enums/objectType";
import type { JsonProps } from "../types/JsonComponentProps";
import type { JsonObjectType } from "../types/JsonTypes";
import { MinusMenuElement, PlusMenuElement } from "./defaultElements/defaultElements";
import JsonAddValue from "./JsonAddValue";
import JsonNode from "./JsonNode";

type Props = JsonProps & {handleRemove: () => void};

function JsonObject({name, keyPath: propKeyPath, depth, handleRemove, dataType}: Props) {
  // == State ==
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);

  // == Memos ==
  const keyPath = useMemo<string[]>(() => (
    depth === -1 ? [] : [...propKeyPath, name]
  ), []);

  // == Callbacks ==

  const onChildUpdate = useCallback((childKey, childData) => {
    const { data, keyPath } = this.state;
    // Update data
    data[childKey] = childData;
    // Put new data
    this.setState({
      data,
    });
    // Spread
    const { onUpdate } = this.props;
    const size = keyPath.length;
    onUpdate(keyPath[size - 1], data);
  });

  handleAddMode() {
    this.setState({
      addFormVisible: true,
    });
  }

  handleAddValueCancel() {
    this.setState({
      addFormVisible: false,
    });
  }

  handleAddValueAdd({ key, newValue }) {
    const { data, keyPath, nextDeep: deep } = this.state;
    const { beforeAddAction, logger } = this.props;

    beforeAddAction(key, keyPath, deep, newValue)
      .then(() => {
        // Update data
        data[key] = newValue;
        this.setState({
          data,
        });
        // Cancel add to close
        this.handleAddValueCancel();
        // Spread new update
        const { onUpdate, onDeltaUpdate } = this.props;
        onUpdate(keyPath[keyPath.length - 1], data);
        // Spread delta update
        onDeltaUpdate({
          type: ADD_DELTA_TYPE,
          keyPath,
          deep,
          key,
          newValue,
        });
      })
      .catch(logger.error);
  }

  handleRemoveValue(key) {
    return () => {
      const { beforeRemoveAction, logger } = this.props;
      const { data, keyPath, nextDeep: deep } = this.state;
      const oldValue = data[key];
      // Before Remove Action
      beforeRemoveAction(key, keyPath, deep, oldValue)
        .then(() => {
          const objType = getObjectType(oldValue);
          const deltaUpdateResult = {
            keyPath,
            deep,
            key,
            oldValue,
          };

          if (objType === "Object" || objType === "Array") {
            deltaUpdateResult.type = UPDATE_DELTA_TYPE;
            deltaUpdateResult.newValue = null;
            data[key] = null;
          } else {
            deltaUpdateResult.type = REMOVE_DELTA_TYPE;
            delete data[key];
          }
          this.setState({
            data,
          });
          // Spread new update
          const { onUpdate, onDeltaUpdate } = this.props;
          onUpdate(keyPath[keyPath.length - 1], data);
          // Spread delta update
          onDeltaUpdate(deltaUpdateResult);
        })
        .catch(logger.error);
    };
  }

  handleCollapseMode() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  handleEditValue({ key, value }) {
    return new Promise((resolve, reject) => {
      const { beforeUpdateAction } = this.props;
      const { data, keyPath, nextDeep: deep } = this.state;

      // Old value
      const oldValue = data[key];

      // Before update action
      beforeUpdateAction(key, keyPath, deep, oldValue, value)
        .then(() => {
          // Update value
          data[key] = value;
          // Set state
          this.setState({
            data,
          });
          // Spread new update
          const { onUpdate, onDeltaUpdate } = this.props;
          onUpdate(keyPath[keyPath.length - 1], data);
          // Spread delta update
          onDeltaUpdate({
            type: UPDATE_DELTA_TYPE,
            keyPath,
            deep,
            key,
            newValue: value,
            oldValue,
          });
          // Resolve
          resolve();
        })
        .catch(reject);
    });
  }

  renderCollapsed() {
    const { name, keyPath, deep, data } = this.state;
    const { handleRemove, readOnly, dataType, getStyle, minusMenuElement } =
      this.props;

    const { minus, collapsed } = getStyle(name, data, keyPath, deep, dataType);
    const keyList = Object.getOwnPropertyNames(data);
    const collapseValue = " {...}";
    const numberOfItems = keyList.length;
    const itemName = numberOfItems > 1 ? "keys" : "key";
    let minusElement = null;
    // Check if readOnly is activated
    if (!readOnly(name, data, keyPath, deep, dataType)) {
      const minusMenuLayout = React.cloneElement(minusMenuElement, {
        onClick: handleRemove,
        className: "rejt-minus-menu",
        style: minus,
      });
      minusElement = deep !== -1 ? minusMenuLayout : null;
    }

    /* eslint-disable jsx-a11y/no-static-element-interactions */
    return (
      <span className="rejt-collapsed">
        <span
          className="rejt-collapsed-text"
          style={collapsed}
          onClick={this.handleCollapseMode}
        >
          {collapseValue} {numberOfItems} {itemName}
        </span>
        {minusElement}
      </span>
    );
    /* eslint-enable */
  }

  renderNotCollapsed() {
    const { name, data, keyPath, deep, nextDeep, addFormVisible } = this.state;
    const {
      isCollapsed,
      handleRemove,
      onDeltaUpdate,
      readOnly,
      getStyle,
      dataType,
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

    const { minus, plus, addForm, ul, delimiter } = getStyle(
      name,
      data,
      keyPath,
      deep,
      dataType
    );
    const keyList = Object.getOwnPropertyNames(data);
    let minusElement = null;
    const readOnlyResult = readOnly(name, data, keyPath, deep, dataType);
    // Check if readOnly is activated
    if (!readOnlyResult) {
      const minusMenuLayout = React.cloneElement(minusMenuElement, {
        onClick: handleRemove,
        className: "rejt-minus-menu",
        style: minus,
      });
      minusElement = deep !== -1 ? minusMenuLayout : null;
    }

    const list = keyList.map((key) => (
      <JsonNode
        key={key}
        name={key}
        data={data[key]}
        keyPath={keyPath}
        deep={nextDeep}
        isCollapsed={isCollapsed}
        handleRemove={this.handleRemoveValue(key)}
        handleUpdateValue={this.handleEditValue}
        onUpdate={this.onChildUpdate}
        onDeltaUpdate={onDeltaUpdate}
        readOnly={readOnly}
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
    ));

    const startObject = "{";
    const endObject = "}";

    let menu = null;
    // Check if readOnly is activated
    if (!readOnlyResult) {
      const plusMenuLayout = React.cloneElement(plusMenuElement, {
        onClick: this.handleAddMode,
        className: "rejt-plus-menu",
        style: plus,
      });
      menu = addFormVisible ? (
        <span className="rejt-add-form" style={addForm}>
          <JsonAddValue
            handleAdd={this.handleAddValueAdd}
            handleCancel={this.handleAddValueCancel}
            addButtonElement={addButtonElement}
            cancelButtonElement={cancelButtonElement}
            inputElementGenerator={inputElementGenerator}
            keyPath={keyPath}
            deep={deep}
            onSubmitValueParser={onSubmitValueParser}
          />
        </span>
      ) : (
        <span>
          {plusMenuLayout} {minusElement}
        </span>
      );
    }

    return (
      <span className="rejt-not-collapsed">
        <span className="rejt-not-collapsed-delimiter" style={delimiter}>
          {startObject}
        </span>
        <ul className="rejt-not-collapsed-list" style={ul}>
          {list}
        </ul>
        <span className="rejt-not-collapsed-delimiter" style={delimiter}>
          {endObject}
        </span>
        {menu}
      </span>
    );
  }

  render() {
    const { name, collapsed, data, keyPath, deep } = this.state;
    const { getStyle, dataType } = this.props;
    const value = collapsed
      ? this.renderCollapsed()
      : this.renderNotCollapsed();
    const style = getStyle(name, data, keyPath, deep, dataType);

    /* eslint-disable jsx-a11y/no-static-element-interactions */
    return (
      <div className="rejt-object-node">
        <span onClick={this.handleCollapseMode}>
          <span className="rejt-name" style={style.name}>
            {name} :{" "}
          </span>
        </span>
        {value}
      </div>
    );
    /* eslint-enable */
  }
}

// Add prop types
JsonObject.propTypes = propTypes;
// Add default props
JsonObject.defaultProps = defaultProps;

/* ************************************* */
/* ********       EXPORTS       ******** */
/* ************************************* */
export default JsonObject;
