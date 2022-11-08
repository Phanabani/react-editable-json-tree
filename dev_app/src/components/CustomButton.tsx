import React, { ButtonHTMLAttributes } from "react";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

const CustomButton = React.memo(
  React.forwardRef<HTMLButtonElement, Props>(({ ...props }, ref) => (
    <button {...props} ref={ref}>
      Custom button with ref!
    </button>
  ))
);

export default CustomButton;
