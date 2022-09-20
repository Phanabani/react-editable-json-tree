/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 19/10/16
 * Licence: See Readme
 */

import { getObjectType, ObjectType } from "../enums/objectType";

/**
 * TODO Update this doc once you figure out what the function does
 * Is Component will change ?
 * @param oldValue - old value
 * @param newValue - new value
 * @returns result
 */
export function isComponentWillChange(
  oldValue: unknown,
  newValue: unknown
): boolean {
  const oldType = getObjectType(oldValue);
  const newType = getObjectType(newValue);
  return (
    newType !== oldType &&
    (oldType === ObjectType.FUNCTION || newType === ObjectType.FUNCTION)
  );
}

/**
 * Get the return value of {@link valueOrFn} if it's a function, otherwise just
 * return {@link valueOrFn}
 * @param valueOrFn a value or a function to call
 * @param callArgs arguments to call {@link valueOrFn} with if it's a function
 */
export function maybeCall<Value, Fn extends (...args: any[]) => any>(
  valueOrFn: Value | Fn,
  ...callArgs: Parameters<Fn>
): Value {
  if (valueOrFn instanceof Function) {
    return valueOrFn(...callArgs);
  }
  return valueOrFn;
}
