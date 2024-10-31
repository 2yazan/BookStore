import React, { useState, useEffect, useContext, useCallback } from "react";
import Navigation from "../../components/Main Components/Navigation";
import Footer from "../../components/Main Components/Footer";
import { PageTemplate } from "../../components/Main Components/PageTemplate.jsx";
import AuthContext from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";



function Cart() {
  const { authTokens, logoutCustomer } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const fetchCartItems = useCallback(async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/view_cart/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      });
      if (response.ok) {
        const data = await response.json();
        const modifiedData = data.map((item) => ({
          ...item,
          book: {
            ...item.book,
            image: `http://127.0.0.1:8000${item.book.image}`,
          },
        }));
        const sortedCartItems = modifiedData.sort(
          (a, b) => a.book.id - b.book.id
        );
        setCartItems(sortedCartItems);
      } else {
        console.error("Failed to fetch cart items:", response.statusText);
        logoutCustomer();
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  }, [authTokens, logoutCustomer]);

  const calculateTotalPrice = useCallback(() => {
    const total = cartItems.reduce(
      (accumulator, item) => accumulator + item.book.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  useEffect(() => {
    calculateTotalPrice();
  }, [calculateTotalPrice]);

  const addToCart = async (bookId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/add_to_cart/${bookId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
          body: JSON.stringify({
            quantity: 1,
          }),
        }
      );
      if (response.ok) {
        console.log("Item added to cart successfully!");
        fetchCartItems();
      } else {
        console.error("Failed to add item to cart:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const deleteFromCart = async (orderItemId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/delete_from_cart/${orderItemId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      if (response.ok) {
        console.log("Item deleted from cart successfully!");
        fetchCartItems();
      } else {
        console.error("Failed to delete item from cart:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting item from cart:", error);
    }
  };

  const removeFromCart = async (orderItemId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/remove_from_cart/${orderItemId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      if (response.ok) {
        console.log("Item removed from cart successfully");
        fetchCartItems();
      } else {
        console.error("Failed to remove item from cart:", response.statusText);
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  return (
    <>
      <div>
        <Navigation />
        <PageTemplate>
          {cartItems.length > 0 ? (
            <div>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg md:mt-14 sm:max-w-2xl xl:p-10">
                <table className="w-full font-montserrat text-sm text-left rtl:text-right">
                  <thead className="text-xs bg-gray-100">
                    <tr>
                      <th scope="col" className="px-6 py-3">Item Name</th>
                      <th scope="col" className="px-6 py-3">Quantity</th>
                      <th scope="col" className="px-6 py-3">Price</th>
                      <th scope="col" className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id} className="bg-white dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-100">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <a href={`/book/${item.book.title}/${item.book.id}`} className="flex items-center space-x-2">
                              <img src={item.book.image} className="w-20 h-30 mr-2" alt={item.book.title} />
                              <span>{item.book.title}</span>
                            </a>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="bg-gray-100 rounded-full px-4 py-2 flex items-center">
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-gray-700 hover:text-gray-900 focus:outline-none"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M18 12H6"
                                  />
                                </svg>
                              </button>
                              <input
                                type="text"
                                className="bg-transparent w-12 text-center focus:outline-none"
                                value={item.quantity}
                                readOnly
                              />
                              <button
                                onClick={() => addToCart(item.book.id)}
                                className="text-gray-700 hover:text-gray-900 focus:outline-none"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">{(item.book.price * item.quantity).toFixed(2)}$</td>
                        <td className="px-6 py-4">
                          <button
                            className="text-gray-800 hover:underline"
                            onClick={() => deleteFromCart(item.id)}
                          >
                            <FaTrash className="inline-block" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end font-semibold text-gray-900 mt-5">
                <span className="px-6 py-3 text-gray-800">Subtotal</span>
                <span className="px-6 py-3">{totalPrice} $</span>
                <Link to="/checkout">
                  <button
                    type="button"
                    className="flex items-center text-white justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500 p-2 transition duration-300 ease-in-out hover:text-gray-800 hover:ring-2 hover:ring-gray-800 group"
                  >
                    Checkout
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="font-montserrat text-center mt-80 mb-auto">
              No items in your cart.
            </div>
          )}
        </PageTemplate>
        <Footer />
      </div>
    </>
  );
}

export default Cart;