import React from "react";
import type { JsonFieldType } from "../enums/jsonFieldType";
import type {
  Data,
  Depth,
  KeyName,
  KeyPath,
  TreeArgs,
  TreeStyles,
  ValueParser,
} from "../types/JsonTree";
import type { MaybeFactory } from "../types/misc";

export type TreeArgsWithJsonFieldType = TreeArgs & {
  jsonFieldType: JsonFieldType;
};

export type MaybeElementFactory = MaybeFactory<
  TreeArgsWithJsonFieldType,
  JSX.Element
>;

type Action<T> = (
  args: Omit<TreeArgs, "dataType" | "data"> & T
) => Promise<void>;

export interface JsonTreeContextType {
  // TODO check these callback types
  isCollapsed?: (args: { keyPath: KeyPath; depth: Depth }) => boolean;
  onFullyUpdate?: (args: { data: Data }) => void;
  onDeltaUpdate?: (args: TreeArgs & { oldValue: Data; newValue: Data }) => void;
  readOnly?: MaybeFactory<TreeArgs, boolean>;
  getStyle?: (args: TreeArgs) => TreeStyles;
  onSubmitValueParser?: ValueParser;

  beforeRemoveAction?: Action<{ oldValue: Data }>;
  beforeAddAction?: Action<{ newValue: Data }>;
  beforeUpdateAction?: Action<{ oldValue: Data; newValue: Data }>;
  handleRemove?: () => Promise<void>;
  handleUpdateValue?: (data: { key: KeyName; value: Data }) => Promise<void>;

  logger?: { error: (reason: unknown) => void };

  addButtonElement?: JSX.Element;
  cancelButtonElement?: JSX.Element;
  editButtonElement?: JSX.Element;
  inputElement?: MaybeElementFactory;
  textareaElement?: MaybeElementFactory;
  minusMenuElement?: JSX.Element;
  plusMenuElement?: JSX.Element;
}

export const JsonTreeContext = React.createContext<JsonTreeContextType>({
  isCollapsed: undefined,
  onFullyUpdate: undefined,
  onDeltaUpdate: undefined,
  // TODO rename to isReadOnly
  readOnly: undefined,
  getStyle: undefined,
  onSubmitValueParser: undefined,

  beforeRemoveAction: undefined,
  beforeAddAction: undefined,
  beforeUpdateAction: undefined,
  handleRemove: undefined,
  handleUpdateValue: undefined,

  logger: undefined,

  addButtonElement: undefined,
  cancelButtonElement: undefined,
  editButtonElement: undefined,
  inputElement: undefined,
  textareaElement: undefined,
  minusMenuElement: undefined,
  plusMenuElement: undefined,
});
