import React from "react";

const TagButton = ({ tagName }) => {
  return (
    <div className="relative mt-2">
      <span className="bg-gradient-to-b from-green-500 to-emerald-500 text-white text-xs font-medium me-2 px-3 py-1 rounded ring-2 ring-transparent hover:ring-gray-800 hover:bg-gray-800 hover:text-gray-800">
        {tagName}
      </span>
    </div>
  );
};

export { TagButton };
