/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 19/10/16
 * Licence: See Readme
 */

/**
 * Get Object type.
 * @param obj {*} object to get type
 * @returns {*}
 */
export function getObjectType(obj: unknown): string {
  if (
    obj !== undefined &&
    obj !== null &&
    typeof obj === "object" &&
    !Array.isArray(obj) &&
    typeof (<any>obj)[Symbol.iterator] === "function"
  ) {
    return "Iterable";
  }
  return Object.prototype.toString.call(obj).slice(8, -1);
}

/**
 * Is Component will change ?
 * @param oldValue {*} old value
 * @param newValue {*} new value
 * @returns {boolean} result
 */
export function isComponentWillChange(oldValue: unknown, newValue: unknown) {
  const oldType = getObjectType(oldValue);
  const newType = getObjectType(newValue);
  return (
    (oldType === "Function" || newType === "Function") && newType !== oldType
  );
}
