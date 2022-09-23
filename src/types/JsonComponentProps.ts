import type { Depth, KeyName, KeyPath } from "./JsonTree";
import type { JsonElementType } from "./JsonTypes";

export interface PositionedPartialJsonProps {
  keyPath: KeyPath;
  depth: Depth;
}

export interface NamedPartialJsonProps extends PositionedPartialJsonProps {
  name: KeyName;
}

export interface JsonProps<T extends JsonElementType>
  extends NamedPartialJsonProps {
  data: T;
}
