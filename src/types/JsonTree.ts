import type { ObjectType } from "../enums/objectType";

export type KeyName = string;
export type Data = unknown;
export type KeyPath = string[];
export type Depth = number;

export type TreeArgs = {
  keyName: KeyName;
  keyPath: KeyPath;
  depth: Depth;
  data: Data;
  dataType: ObjectType;
};

export type ValueParser = (
  args: Omit<TreeArgs, "data" | "dataType"> & {
    isEditMode: boolean;
    rawValue: string;
  }
) => Data;
