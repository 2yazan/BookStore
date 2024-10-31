import React, { useContext } from "react";
import { FaShoppingCart } from "react-icons/fa";
import AuthContext from "../../context/AuthContext";

const AddToCartButton = ({ bookId, quantity, toggleModal }) => {
  const { authTokens } = useContext(AuthContext);

  const addToCart = async () => {
    try {
      if (!authTokens) {
        console.error("Authentication tokens are missing.");
        return;
      }

      const response = await fetch(
        `http://127.0.0.1:8000/api/add_to_cart/${bookId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
          body: JSON.stringify({
            quantity: quantity,
          }),
        }
      );
      if (response.ok) {
        console.log("Item added to cart successfully!");
        // Call toggleModal to display the modal
        toggleModal();
      } else {
        console.error("Failed to add item to cart:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  return (
    <div className="relative mt-2">
      <button
        type="button"
        className="flex font-montserrat text-white bg-gradient-to-b from-green-500 to-emerald-500 font-medium ring-2 ring-transparent hover:ring-gray-800 hover:bg-gray-800 hover:text-gray-800 focus:outline-none focus:ring-2 rounded-full text-xs px-5 py-3 text-center"
        onClick={addToCart}
      >
        <span>Add to cart</span>
        <span className="ml-2">
          <FaShoppingCart />
        </span>
      </button>
    </div>
  );
};

export { AddToCartButton };
