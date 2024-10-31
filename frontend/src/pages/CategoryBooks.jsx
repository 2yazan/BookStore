
import { Link, useParams } from "react-router-dom";
import { BookContainer } from "../components/Containers/BookContainer";
import { useState, useEffect } from "react";
import Navigation from "../components/Main Components/Navigation";
import Footer from "../components/Main Components/Footer";
import { PageTemplate } from "../components/Main Components/PageTemplate";

const fetchCategory = (url, setCategoryTitle, setTotalResult, setTotalPages) => {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      setCategoryTitle(data.title);
      setTotalResult(data.count);
      setTotalPages(Math.ceil(data.count / 15)); 
    })
    .catch((error) => {
      console.error("Error fetching category:", error);
    });
};

const fetchBooks = (url, setBooks) => {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      setBooks(data.results);
    })
    .catch((error) => {
      console.error("Error fetching books:", error);
    });
};

function CategoryBooks() {
  const baseUrl = "http://127.0.0.1:8000/api";
  const [categoryTitle, setCategoryTitle] = useState("");
  const [books, setBooks] = useState([]);
  const { category_id } = useParams();
  const [setTotalResult] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCategory(baseUrl + `/category/${category_id}`, setCategoryTitle, setTotalResult, setTotalPages);
    fetchBooks(baseUrl + `/books/?category=${category_id}`, setBooks);
  }, [category_id, setCategoryTitle, setTotalResult, setTotalPages, setBooks]);

  const changeUrl = (pageNumber) => {
    fetchBooks(
      baseUrl + `/category/${categoryTitle}/${category_id}?page=${pageNumber}`,
      setBooks
    );
  };

  var links = [];
  for (let i = 1; i <= totalPages; i++) {
    links.push(
      <li key={i}>
        <Link
          onClick={() => changeUrl(i)}
          to={`/category/${categoryTitle}/${category_id}?page=${i}`}
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
        <div className="container font-montserrat mt-10 mx-auto px-1">
          <main className="mt-4">
            <h1 className="text-xl font-medium flex justify-between items-center">
              {categoryTitle ? categoryTitle : "Category Title"}
            </h1>
            <div className="grid grid-cols-1 mt-10 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {books &&
                books.map((book) => (
                  <div key={book.id} className="col-span-1">
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

export default CategoryBooks;
