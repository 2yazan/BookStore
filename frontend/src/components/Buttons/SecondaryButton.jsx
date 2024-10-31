import React from "react";

export const SecondaryButton = ({ children, className }) => {
  const buttonClasses =
    "text-gray-500 bg-white focus:outline-none hover:ring-2 hover:ring-gray-800 rounded-full px-4 py-2 text-center flex items-center justify-center " +
    className;

  return (
    <button type="submit" className={buttonClasses}>
      {children}
    </button>
  );
};
