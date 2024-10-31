import React from "react";

const AddedtoCart = ({ closeModal }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-gray-700 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg w-80 font-montserrat flex flex-col items-center">
        <h2 className="text-xl font-md mb-4">Added to cart!</h2>

        <button
          onClick={closeModal}
          className="bg-gradient-to-b from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg ring-2 ring-transparent hover:ring-gray-800 hover:bg-gray-800 hover:text-gray-800 transition duration-300 ease-in-out"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AddedtoCart;
