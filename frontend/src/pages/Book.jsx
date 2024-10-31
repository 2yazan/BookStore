import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PageTemplate } from "../components/Main Components/PageTemplate";
import Navigation from "../components/Main Components/Navigation";
import Footer from "../components/Main Components/Footer";
import { AddToCartButton } from "../components/Buttons/AddToCartButton";
import { TagButton } from "../components/Buttons/TagButton";
import ReactStars from "react-rating-stars-component";
import { parseISO, format } from "date-fns";
import AddedtoCart from "../components/Modals/AddedtoCart";


function Book() {
  const baseUrl = "http://127.0.0.1:8000/api";
  const [bookData, setBookData] = useState({});
  const [bookTags, setBookTags] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const { book_id } = useParams();

  useEffect(() => {
    fetchData(baseUrl + `/book/${book_id}`);
    fetchRatings(baseUrl + `/book/${book_id}/ratings/`);
  }, [book_id]);

  function fetchData(url) {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setBookData(data);
        setBookTags(data.tag_list);
      });
  }

  function fetchRatings(url) {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setRatings(data);
      })
      .catch((error) => {
        console.error("Error fetching book ratings:", error);
      });
  }

  const tagLinks = bookTags.map((tag, index) => (
    <Link key={index} to={`/books/tag/${tag}`}>
      <TagButton tagName={tag} />
    </Link>
  ));

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div>
      <Navigation />
      <PageTemplate>
        <div className="pt-12 pb-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-12 gap-10">
              <div className="col-span-5">
                <div className="bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={bookData.image}
                    className="w-full h-full object-contain p-8"
                    alt={bookData.title}
                  />
                </div>
              </div>
  
              <div className="col-span-7 font-montserrat">
                <div>
                  <h1 className="text-3xl font-bold mb-4">{bookData.title}</h1>
                  <div className="flex items-center mb-6">
                    <p className="text-gray-600 text-sm mr-4">
                      by {bookData.author}
                    </p>
                    {bookData.publish_date && (
                      <p className="text-gray-600 text-sm">
                        Published in {bookData.publish_date.slice(0, 4)}
                      </p>
                    )}
                  </div>
  
                  <p className="text-gray-700 text-lg mb-8">
                    {bookData.description}
                  </p>
  
                  <div className="flex items-center justify-between mb-8">
                    <p className="text-3xl font-bold text-gray-900">
                      Price: ${bookData.price}
                    </p>
  
                    <div className="bg-gray-100 rounded-full px-4 py-2 flex items-center">
                      <button
                        onClick={decrementQuantity}
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
                        value={quantity}
                        readOnly
                      />
                      <button
                        onClick={incrementQuantity}
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
  
                    <AddToCartButton
                      bookId={bookData.id}
                      quantity={quantity}
                      toggleModal={toggleModal}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                    />
                  </div>
  
                  <div className="mb-8">
                    <p className="text-lg font-bold mb-4">Product Details</p>
                    <div className="bg-gray-100 rounded-lg p-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-600 text-sm mb-1">ISBN</p>
                          <p className="text-gray-800 font-medium">
                            {bookData.isbn}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm mb-1">Author</p>
                          <p className="text-gray-800 font-medium">
                            {bookData.author}
                          </p>
                        </div>
   <div>
                          <p className="text-gray-600 text-sm mb-1">
                            Date Published
                          </p>
                          <p className="text-gray-800 font-medium">
                            {bookData.publish_date}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm mb-1">Tags</p>
                          <div className="flex flex-wrap gap-2">{tagLinks}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
            <div className="mt-12"> 
              <p className="text-lg font-bold mb-4">Customer Reviews</p>
              {ratings.length > 0 ? (
                <div className="space-y-4 max-w-md">
                  {ratings.map((rating) => (
                    <div
                      key={rating.id}
                      className="bg-gray-100 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-800 font-medium">
                          {rating.created_by || "Anonymous"}
                        </p>
                        <ReactStars
                          count={5}
                          value={rating.rating}
                          size={18}
                          activeColor="#ffd700"
                          edit={false}
                        />
                      </div>
                      <p className="text-gray-700">{rating.reviews}</p>
                      <p className="text-gray-600 text-sm mt-2">
                        {format(
                          parseISO(rating.review_date),
                          "MMM d, yyyy 'at' HH:mm:ss"
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">
                  No reviews and ratings for this book.
                </p>
              )}
            </div>
        </div>
      </PageTemplate>
      <Footer />
      {showModal && <AddedtoCart closeModal={toggleModal} />}
    </div>
  );
}

export default Book;
