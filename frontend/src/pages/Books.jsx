import { Link } from "react-router-dom";
import { BookContainer } from "../components/Containers/BookContainer";
import { useState, useEffect } from "react";
import Navigation from "../components/Main Components/Navigation";
import Footer from "../components/Main Components/Footer";
import { PageTemplate } from "../components/Main Components/PageTemplate";

function Books() {
  const baseUrl = "http://127.0.0.1:8000/api";
  const [books, setBooks] = useState([]);
  const [totalResult, setTotalResult] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    fetchBooks(baseUrl + "/books");
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredBooks(
        books.filter((book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredBooks(books);
    }
  }, [searchTerm, books]);

  function fetchBooks(baseUrl) {
    fetch(baseUrl)
      .then((response) => response.json())
      .then((data) => {
        setBooks(data.results);
        setTotalResult(data.count);
        setTotalPages(Math.ceil(data.count / 15));
        setFilteredBooks(data.results); // Initialize filtered books
      });
  }

  function changeUrl(baseUrl) {
    fetchBooks(baseUrl);
  }

  var links = [];
  for (let i = 1; i <= totalPages; i++) {
    links.push(
      <li key={i}>
        <Link
          onClick={() => changeUrl(baseUrl + `/books/?page=${i}`)}
          to={`/books/?page=${i}`}
          className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          {i}
        </Link>
      </li>
    );
  }

  return (
    <div>
      <Navigation />
      <PageTemplate>
        <div className="container mx-auto px-1">
          <main className="mt-4">
            <h1 className="text-xl font-medium mb-4 flex justify-between items-center">
              All Books{" "}
            </h1>
            {/* Search Bar */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search for books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-800"
              />
            </div>
            <div className="grid font-montserrat grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              {filteredBooks &&
                filteredBooks.map((book) => (
                  <div key={book.id} className="">
                    <BookContainer book={book} />
                  </div>
                ))}
            </div>
            {totalPages > 1 && (
              <nav>
                <ul className="inline-flex -space-x-px text-sm mt-3">
                  {links}
                </ul>
              </nav>
            )}
          </main>
        </div>
      </PageTemplate>
      <Footer />
    </div>
  );
}

export default Books;
