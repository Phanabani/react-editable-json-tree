import type { JsonElementType } from "./JsonTypes";

export interface PositionedPartialJsonProps {
  keyPath: string[];
  depth: number;
}

export interface NamedPartialJsonProps extends PositionedPartialJsonProps {
  name: string;
}

export interface JsonProps<T extends JsonElementType>
  extends NamedPartialJsonProps {
  data: T;
}
