/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 20/10/16
 * Licence: See Readme
 */

import type { TreeStyles } from "../types/JsonTree";

export const object: TreeStyles = {
  minus: {
    color: "red",
  },
  plus: {
    color: "green",
  },
  collapsed: {
    color: "grey",
  },
  delimiter: {},
  ul: {
    padding: "0px",
    margin: "0 0 0 25px",
    listStyle: "none",
  },
  name: {
    color: "#2287CD",
  },
  addForm: {},
};

export const array: TreeStyles = {
  minus: {
    color: "red",
  },
  plus: {
    color: "green",
  },
  collapsed: {
    color: "grey",
  },
  delimiter: {},
  ul: {
    padding: "0px",
    margin: "0 0 0 25px",
    listStyle: "none",
  },
  name: {
    color: "#2287CD",
  },
  addForm: {},
};

export const value: TreeStyles = {
  minus: {
    color: "red",
  },
  editForm: {},
  value: {
    color: "#7bba3d",
  },
  li: {
    minHeight: "22px",
    lineHeight: "22px",
    outline: "0px",
  },
  name: {
    color: "#2287CD",
  },
};
