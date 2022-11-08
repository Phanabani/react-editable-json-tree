import React, { ButtonHTMLAttributes } from "react";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

const CustomButtonNoRefForwarding = React.memo<Props>(({ ...props }) => (
  <button {...props}>Custom button!</button>
));

export default CustomButtonNoRefForwarding;
