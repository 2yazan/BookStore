import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import { BookContainer } from "../components/Containers/BookContainer";
import { CategoryContainer } from "../components/Containers/CategoryContainer";
import Navigation from "../components/Main Components/Navigation";
import { Header } from "../components/Header";
import Footer from "../components/Main Components/Footer";
import { PageTemplate } from "../components/Main Components/PageTemplate";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

function Home() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = "http://127.0.0.1:8000/api";
  const imageUrl = 'https://toolxox.com/dl/2/ay_1/images/dl.beatsnoop.com-ultra-xmXqKOTvNh.jpg';


  useEffect(() => {
    fetchBooksAndCategories();
  }, []);

  useEffect(() => {
    fetchBooks(baseUrl + "/books/?fetch_limit=5");
  }, []);

  function fetchBooks(baseUrl) {
    fetch(baseUrl)
      .then((response) => response.json())
      .then((data) => {
        setBooks(data.results);
      });
  }
  

  async function fetchBooksAndCategories() {
    try {
      const [booksResponse, categoriesResponse] = await Promise.all([
        fetch(baseUrl + "/books/?fetch_limit=5"),
        fetch(baseUrl + "/categories/?fetch_limit=6"),
      ]);

      const booksData = await booksResponse.json();
      const categoriesData = await categoriesResponse.json();

      setBooks(booksData.results);
      setCategories(categoriesData.results);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  }

  return (
    <div>
      <Navigation />
      <Header />
      <PageTemplate>
        <div className="container mx-auto px-1">
          <main className="mt-4 font-montserrat">
            <h1 className="text-xl mb-6 font-medium flex justify-between items-center">
              Most Popular Categories
              <Link
                to="/categories"
                className="text-sm text-gray-900 hover:text-primary-500 hover:underline font-normal flex items-center"
              >
                View All <HiOutlineArrowLongRight className="ml-2" />
              </Link>
            </h1>
            {loading ? (
              <p>Loading categories...</p>
            ) : (
              <Swiper
                spaceBetween={20}
                slidesPerView={2}
                breakpoints={{
                  640: {
                    slidesPerView: 3,
                  },
                  768: {
                    slidesPerView: 4,
                  },
                  1024: {
                    slidesPerView: 6,
                  },
                }}
              >
                {categories.map((category) => (
                  <SwiperSlide key={category.id}>
                    <CategoryContainer category={category} />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
            <div className="mt-20">
              <h1 className="text-xl font-medium mb-4 flex justify-between items-center">
                New Books
                <Link
                  to="/books"
                  className="text-sm text-gray-900 hover:text-primary-500 hover:underline font-normal flex items-center"
                >
                  View All <HiOutlineArrowLongRight className="ml-1" />
                </Link>
              </h1>
              {loading ? (
                <p>Loading books...</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"> 
                  {books.map((book) => (
                    <div key={book.id} className="col-span-1">
                      <BookContainer book={book} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* New Section to add under books */}
            <section className="max-w-6xl grid md:grid-cols-2 md:gap-4 mx-4 xl:mx-auto mt-10">
              <img src={imageUrl} className="w-full object-cover p-10" />
                <div className="flex flex-col self-center p-8 items-center lg:items-start">
                  <h3 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                    Fictions or non-fictions for you
                  </h3>
                  <p className="mb-5 font-normal dark:text-gray-800 text-center lg:text-left">
                  Your next favorite book is just a click away. Browse our curated collection, order effortlessly,
                   and let us deliver captivating reads straight to your doorstep. Begin your literary journey today!
                  </p>
                  <div>
                    <Link
                     to="/books"
                     className="text-white mt-2 bg-gradient-to-b from-green-500 to-emerald-500  hover:bg-gray-800 hover:text-gray-800 hover:ring-2 hover:ring-gray-800 rounded-full text-xs px-5 py-3"
                    >
                      Check it Out
                    </Link>
                 </div>
              </div>
            </section>
          </main>
        </div>
      </PageTemplate>
      <Footer />
    </div>
  );
}

export default Home;
