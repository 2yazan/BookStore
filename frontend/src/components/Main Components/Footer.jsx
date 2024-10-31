import React from "react";
import { MdLocalLibrary } from "react-icons/md";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 bg-gradient-to-b from-gray-800 to-gray-950">
      <div className="mx-auto w-full container py-10 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-start">
            <Link to="/" className="flex mb-3">
              <MdLocalLibrary
                style={{ fontSize: "2rem" }}
                className="mr-3 text-green-700 dark:text-white"
              />
              <span className="self-center text-xl font-bold whitespace-nowrap text-green-700 dark:text-white">
                Book Store
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 font-semibold">Connect with us</p>
            <div className="flex mt-3 gap-4">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-cyan-900 dark:hover:text-white"
              >
                <FaFacebook />
                <span className="sr-only">Facebook page</span>
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-cyan-900 dark:hover:text-white"
              >
                <FaInstagram />
                <span className="sr-only">Instagram page</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-cyan-900 dark:hover:text-white"
              >
                <FaTwitter />
                <span className="sr-only">Twitter page</span>
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-cyan-900 dark:hover:text-white"
              >
                <FaYoutube />
                <span className="sr-only">YouTube channel</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-400 uppercase dark:text-white">Books</h3>
            <ul>
              <li className="mb-2">
                <Link
                  to="/books"
                  className="font-normal text-gray-600 dark:text-gray-400 dark:hover:text-white hover:underline"
                >
                  All Books
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/books"
                  className="font-normal text-gray-600 dark:text-gray-400 dark:hover:text-white hover:underline"
                >
                  Buy Books
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/books"
                  className="font-normal text-gray-600 dark:text-gray-400 dark:hover:text-white hover:underline"
                >
                  Search Books
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-400 uppercase dark:text-white">Help and support</h3>
            <ul>
              <li className="mb-2">
                <Link
                  to="/"
                  className="font-normal text-gray-600 dark:text-gray-400 dark:hover:text-white hover:underline"
                >
                  About us
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/"
                  className="font-normal text-gray-600 dark:text-gray-400 dark:hover:text-white hover:underline"
                >
                  Contact us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-400 uppercase dark:text-white">Legal</h3>
            <ul>
              <li className="mb-2">
                <Link
                  to="/"
                  className="font-normal text-gray-600 dark:text-gray-400 dark:hover:text-white hover:underline"
                >
                  Privacy Policy
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/"
                  className="font-normal text-gray-600 dark:text-gray-400 dark:hover:text-white hover:underline"
                >
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="py-2 text-center mt-6">
          <p className="font-normal text-gray-600 dark:text-gray-400">Book Store © {year}</p>
        </div>
      </div>
    </footer>
  );
}
