import type { ObjectType } from "../enums/objectType";
import type { Data, Depth, KeyName, KeyPath } from "./JsonTree";

export interface PositionedPartialJsonProps {
  keyPath: KeyPath;
  depth: Depth;
}

export interface NamedPartialJsonProps extends PositionedPartialJsonProps {
  name: KeyName;
}

export interface JsonProps extends NamedPartialJsonProps {
  data: Data;
  dataType: ObjectType;
}
