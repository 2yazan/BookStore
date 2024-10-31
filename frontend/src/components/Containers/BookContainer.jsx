import React, { useState, useEffect } from "react";
import { AddToCartButton } from "../Buttons/AddToCartButton";
import { Link } from "react-router-dom";
import AddedtoCart from "../Modals/AddedtoCart";

const BookContainer = ({ book }) => {
  const [showModal, setShowModal] = useState(false);
  const [bookData, setBookData] = useState(null);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/book/${book.id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch book data");
        }
        const data = await response.json();
        setBookData(data);
      } catch (error) {
        console.error("Error fetching book data:", error);
      }
    };

    if (book && book.id) {
      fetchData();
    }
  }, [book]);

  if (!book || !book.title || !bookData) {
    return null;
  }

  const { title, author, image } = bookData;

  return (
    <div className="m-3">
      <div className="w-48 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden group hover:border-gray-300 transition-colors duration-300">
        <div className="p-3 flex flex-col items-center h-full">
          <Link to={`/book/${title}/${book.id}`} className="block">
            <div className="w-40 h-56 mb-3">
              <img
                src={image}
                alt={`Book cover for ${title}`}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                loading="eager"
              />
            </div>

            <h3 className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[40px] group-hover:text-blue-600 transition-colors text-center">
              {title}
            </h3>
            <p className="text-xs text-gray-500 mt-1 mb-3 text-center">
              {author}
            </p>
          </Link>

          <span className="text-gray-800 font-semibold text-lg mb-2">
            ${book.price}
          </span>
          
          <div className="w-36">
            <AddToCartButton 
              bookId={book.id} 
              toggleModal={toggleModal}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-medium py-2 rounded-md transition-colors text-center"
            >
              Add to Cart
            </AddToCartButton>
          </div>
        </div>
      </div>

      {showModal && (
        <AddedtoCart closeModal={toggleModal}>
          <p className="text-sm text-gray-600">Added to cart</p>
        </AddedtoCart>
      )}
    </div>
  );
};

export { BookContainer };