/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 18/10/16
 * Licence: See Readme
 */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { HotKeys } from "react-hotkeys";
import { JsonTreeContext } from "../contexts/jsonTreeContextType";
import { JsonFieldType } from "../enums/jsonFieldType";
import type { JsonProps } from "../types/JsonComponentProps";
import type { Data } from "../types/JsonTree";
import { isComponentWillChange, maybeCall } from "../utils/misc";
import { objectToString } from "../utils/objectToString";

interface Props extends JsonProps {
  originalData?: Data;
}

function JsonValue({
  name,
  keyPath: propsKeyPath,
  depth,
  data,
  dataType,
  originalData,
}: Props) {
  // == State ==
  const [keyPath, setKeyPath] = useState<string[]>([...propsKeyPath, name]);
  const [editEnabled, setEditEnabled] = useState<boolean>(false);

  // == Other hooks ==
  const inputRef = useRef<HTMLInputElement>();
  const treeContext = useContext(JsonTreeContext);

  // == Memos ==
  const dataString = useMemo<string>(() => objectToString(data), [data]);

  const style = useMemo(
    () =>
      treeContext.getStyle?.({
        keyName: name,
        keyPath,
        depth,
        data: originalData,
        dataType,
      }),
    [dataType, depth, keyPath, name, originalData, treeContext]
  );

  const isReadOnly = useMemo<boolean>(
    () =>
      maybeCall(treeContext.readOnly, {
        keyName: name,
        keyPath,
        depth,
        data: originalData,
        dataType,
      }) ?? false,
    [dataType, depth, keyPath, name, originalData, treeContext]
  );

  // Elements
  const minusElement = useMemo<React.ReactNode>(() => {
    if (editEnabled && !isReadOnly) return null;
    if (isReadOnly) return null;

    const elem = treeContext.minusMenuElement;
    if (!elem) return null;

    return React.cloneElement(elem, {
      onClick: treeContext.handleRemove,
      className: "rejt-minus-menu",
      style: style?.minus,
    });
  }, [
    editEnabled,
    isReadOnly,
    style?.minus,
    treeContext.handleRemove,
    treeContext.minusMenuElement,
  ]);

  const inputElement = useMemo<React.ReactNode>(() => {
    if (!editEnabled || isReadOnly) return null;

    const elem = maybeCall(treeContext.inputElement, {
      keyName: name,
      keyPath: propsKeyPath,
      depth,
      data: originalData,
      dataType,
      jsonFieldType: JsonFieldType.Value,
    });
    if (!elem) return null;

    return React.cloneElement(elem, {
      ref: inputRef,
      defaultValue: originalData,
    });
  }, [
    dataType,
    depth,
    editEnabled,
    isReadOnly,
    name,
    originalData,
    propsKeyPath,
    treeContext.inputElement,
  ]);

  const editButtonElement = useMemo<React.ReactNode>(() => {
    if (!editEnabled || isReadOnly) return null;
    if (!treeContext.editButtonElement) return null;

    return React.cloneElement(treeContext.editButtonElement, {
      onClick: () => setEditEnabled(true),
    });
  }, [editEnabled, isReadOnly, treeContext.editButtonElement]);

  const cancelButtonElement = useMemo<React.ReactNode>(() => {
    if (!editEnabled || isReadOnly) return null;
    if (!treeContext.cancelButtonElement) return null;

    return React.cloneElement(treeContext.cancelButtonElement, {
      onClick: () => setEditEnabled(false),
    });
  }, [editEnabled, isReadOnly, treeContext.cancelButtonElement]);

  const valueElement = useMemo<React.ReactNode>(() => {
    if (editEnabled && !isReadOnly) {
      // Is open for editing
      return (
        <span className="rejt-edit-form" style={style?.editForm}>
          {inputElement} {cancelButtonElement}
          {editButtonElement}
        </span>
      );
    }
    // Not open for editing
    return (
      <span
        className="rejt-value"
        style={style?.value}
        onClick={isReadOnly ? undefined : () => setEditEnabled(true)}
      >
        {dataString}
      </span>
    );
  }, [
    cancelButtonElement,
    dataString,
    editButtonElement,
    editEnabled,
    inputElement,
    isReadOnly,
    style?.editForm,
    style?.value,
  ]);

  // == Effects ==
  useEffect(() => {
    setKeyPath([...propsKeyPath, name]);
  }, [propsKeyPath, name]);

  useEffect(() => {
    if (editEnabled && !isReadOnly) {
      inputRef.current?.focus();
    }
  }, [editEnabled, isReadOnly]);

  // == Callbacks ==
  const handleEdit = useCallback(async () => {
    const newValue = maybeCall(treeContext.onSubmitValueParser, {
      keyName: name,
      keyPath,
      depth,
      isEditMode: true,
      rawValue: inputRef.current?.value ?? "",
    });

    const result = {
      key: name,
      value: newValue,
    };

    // Run update
    try {
      await treeContext.handleUpdateValue?.(result);
    } catch (err) {
      treeContext.logger?.error(err);
    }

    // Cancel edit mode if necessary
    if (!isComponentWillChange(originalData, newValue)) {
      setEditEnabled(false);
    }
  }, [depth, keyPath, name, originalData, treeContext]);

  // == More memos! ==
  const handlers = useMemo(
    () => ({
      esc: () => setEditEnabled(false),
      enter: handleEdit,
    }),
    [handleEdit]
  );

  // == Render ==
  return (
    <HotKeys
      className="rejt-value-node"
      component="li"
      style={style?.li}
      handlers={handlers}
    >
      <span className="rejt-name" style={style?.name}>
        {name} :{" "}
      </span>
      {valueElement}
      {minusElement}
    </HotKeys>
  );
}

export default JsonValue;
