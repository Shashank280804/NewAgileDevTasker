import clsx from "clsx";
import React from "react";

const Button = ({ icon, className, label, type = "button", onClick = () => {} }) => {
  return (
    <button
      type={type}
      className={clsx("px-3 py-2 outline-none", className)}
      onClick={onClick}
    >
      <span>{label}</span>
      {icon && icon}
    </button>
  );
};

export default Button;
