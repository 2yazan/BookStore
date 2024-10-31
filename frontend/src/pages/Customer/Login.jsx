import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { MdLocalLibrary } from "react-icons/md";
import InputBox from "../../components/Main Components/InputBox";
import Navigation from "../../components/Main Components/Navigation";
import Footer from "../../components/Main Components/Footer";
import { PrimaryButton } from "../../components/Buttons/PrimaryButton";
import AuthContext from "../../context/AuthContext";

const Login = () => {
  const [loginFormData, setLoginFormData] = useState({
    username: "",
    password: "",
  });

  const { loginCustomer, error, errorMessage } = useContext(AuthContext);

  const handleInputChange = (event) => {
    setLoginFormData({
      ...loginFormData,
      [event.target.name]: event.target.value,
    });
  };

  const isFormReady = () =>
    loginFormData.username.trim() !== "" &&
    loginFormData.password.trim() !== "";

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await loginCustomer(event);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div>
      <Navigation />
      <div className="min-h-screen flex flex-col justify-center items-center bg-white py-20 px-4 md:px-0">
        <Link
          to="/"
          className="flex items-center mb-6 text-2xl font-bold text-gray-800"
        >
          <MdLocalLibrary className="w-8 h-8 mr-2" />
          Book Store
        </Link>

        <div className="w-full bg-white rounded-lg shadow sm:max-w-md p-6 md:p-8 border border-gray-400">
          <h1 className="text-xl font-bold text-gray-900 md:text-2xl text-center mb-4">
            Login to your account
          </h1>

          {error && (
            <div className="mb-4 text-red-500 text-sm">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">
                Username
              </label>
              <InputBox
                type="text"
                name="username"
                id="username"
                placeholder="Enter username"
                value={loginFormData.username}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-800">
                Password
              </label>
              <InputBox
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                value={loginFormData.password}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="remember" className="flex items-center cursor-pointer text-gray-800">
                <input
                  type="checkbox"
                  name="remember"
                  id="remember"
                  className="h-4 w-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                  onChange={(e) => setLoginFormData({ ...loginFormData, remember: e.target.checked })}
                />
                <span className="ml-2 text-sm">Remember me</span>
              </label>
              
            </div>

            <PrimaryButton disabled={!isFormReady()} className="w-full">
              Log in
            </PrimaryButton>

            <p className="text-sm font-light text-gray-800">
              Don’t have an account yet?{" "}
              <Link to="/customer/register" className="font-medium text-gray-800 hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
