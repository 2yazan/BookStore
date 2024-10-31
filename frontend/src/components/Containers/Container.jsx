import React from "react";

const Container = (props) => {
  return (
    <div
      className={`bg-gradient-to-b from-green-500 to-emerald-500 mb-24 p-8 ${
        props.className ? props.className : ""
      }`}
      style={{ height: "750px" }}
    >
      {props.children}
    </div>
  );
};

export default Container;
