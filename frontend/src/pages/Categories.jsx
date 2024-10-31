import { Link } from "react-router-dom";
import { CategoryContainer } from "../components/Containers/CategoryContainer";
import { useState, useEffect } from "react";
import Navigation from "../components/Main Components/Navigation";
import Footer from "../components/Main Components/Footer";
import { PageTemplate } from "../components/Main Components/PageTemplate";

const fetchCategories = async (baseUrl, setCategories, setTotalResult, setTotalPages, setError, setIsLoading) => {
  try {
    setIsLoading(true);
    const response = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.results) {
      setCategories([]);
      setTotalResult(0);
      setTotalPages(1);
    } else {
      setCategories(data.results);
      setTotalResult(data.count);
      setTotalPages(Math.ceil(data.count / 15));
    }
    setError(null);
  } catch (error) {
    setError(`Error: ${error.message}`);
    setCategories([]);
  } finally {
    setIsLoading(false);
  }
};

function Categories() {
  const baseUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";
  const [categories, setCategories] = useState([]);
  const [totalResult, setTotalResult] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories(
      `${baseUrl}/categories/`, 
      setCategories, 
      setTotalResult, 
      setTotalPages,
      setError,
      setIsLoading
    );
  }, [baseUrl]);

  const changeUrl = (newUrl) => {
    fetchCategories(
      newUrl, 
      setCategories, 
      setTotalResult, 
      setTotalPages,
      setError,
      setIsLoading
    );
  };

  return (
    <div>
      <Navigation />
      <PageTemplate>
        <div className="container mx-auto mt-10 font-montserrat px-1">
          <main className="mt-4">
            <p className="text-xl mb-4 font-medium flex justify-between items-center">
              All Categories
            </p>
            
            {isLoading && (
              <div className="text-center py-4">
                <p>Loading categories...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline"> {error}</span>
              </div>
            )}

            {!isLoading && !error && categories.length === 0 && (
              <div className="text-center py-4">
                <p>No categories found.</p>
              </div>
            )}

            {!isLoading && !error && categories.length > 0 && (
              <div className="grid grid-cols-1 mt-10 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {categories.map((category) => (
                  <div key={category.id} className="col-span-1">
                    <CategoryContainer category={category} />
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && !isLoading && !error && (
              <nav className="mt-4">
                <ul className="inline-flex -space-x-px text-sm">
                  {[...Array(totalPages)].map((_, i) => (
                    <li key={i}>
                      <Link
                        onClick={() => changeUrl(`${baseUrl}/categories/?page=${i + 1}`)}
                        to={`/categories/?page=${i + 1}`}
                        className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        {i + 1}
                      </Link>
                    </li>
                  ))}
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

export default Categories;