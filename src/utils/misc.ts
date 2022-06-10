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
