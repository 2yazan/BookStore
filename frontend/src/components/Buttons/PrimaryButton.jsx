import React from "react";

export const PrimaryButton = ({ children, className }) => {
  const buttonClasses =
    "text-white hover:text-gray-800 bg-gradient-to-b from-green-500 to-emerald-500 hover:ring-2 hover:ring-gray-800 focus:outline-none rounded-full px-5 py-3 text-center " +
    className;

  return (
    <button type="submit" className={buttonClasses}>
      {children}
    </button>
  );
};
