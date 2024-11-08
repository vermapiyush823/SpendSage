// src/Login.jsx

import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [generalError, setGeneralError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300); // Adjust the timing as needed

    return () => clearTimeout(timer);
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError(null);

    try {
      setLoggingIn(true);
      await axios.get("/sanctum/csrf-cookie");

      // Step 2: Make login request
      const response = await axios.post("/login", { email, password });

      if (response.data.message === "ok") {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      } else if (response.data.errors.email) {
        setGeneralError(response.data.errors.email);
      } else if (response.data.errors.password) {
        setGeneralError(response.data.errors.password);
      } else {
        setGeneralError("An unknown error occurred.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setGeneralError(
        err.response.status <= 500
          ? "Email does not exists!"
          : "An unknown error occurred."
      );
    } finally {
      setLoggingIn(false); // Ensure loggingIn is set to false after request
    }
  };

  return (
    <div
      className="min-h-screen 
      bg-transparent
     flex flex-col justify-center sm:py-12"
    >
      <div
        className={`relative py-3 sm:max-w-xl mb-10 w-[500px] transition-opacity duration-700 ease-in-out sm:mx-auto
        ${isVisible ? "blur-none" : "blur-lg"}`}
      >
        {/* Decorative Background */}
        <div
          className="absolute inset-0 bg-gradient-to-r  w-[500px] h-[600px] mt-5 
      from-[#202445]
            to-[#161a42]    
         shadow-lg transform skew-y-6 sm:skew-y-0 sm:-rotate-12 sm:rounded-3xl"
        ></div>
        <div
          className="relative  px-16 pb-20 pt-10 
        border-2 border-[#161A31] bg-[#04071D]
         shadow-lg sm:rounded-3xl h-[620px] "
        >
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div>
              <h1
                className="text-3xl 
                text-white
              font-bold text-center mb-10"
              >
                Spend<span className="text-[#CBACF9]">Sage</span>
              </h1>
              <h1 className="text-2xl font-semibold text-white">
                Welcome Back!
              </h1>
              <p className="mt-2 text-sm text-gray-300">
                Please log in to your account to continue.
              </p>
            </div>

            {/* General Error Message */}
            {generalError && (
              <div
                className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">{generalError}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="relative">
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-4 py-3 rounded-md bg-gray-900 text-white focus:outline-none border-2 border-[#161A31]"
                  placeholder="Email address"
                />
              </div>

              <div className="relative">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-4 py-3 rounded-md bg-gray-900 text-white focus:outline-none border-2 border-[#161A31]"
                  placeholder="Password"
                />
              </div>
              <div className="flex items-center justify-end">
                <div className="text-sm">
                  <a
                    href="/forgot-password"
                    className="font-medium text-purple-300 hover:text-purple-200"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm
                  text-base font-medium text-white bg-gradient-to-r from-[#c3a2f4] to-[#8A3FFC] hover:from-[#8A3FFC] hover:to-[#c3a2f4]
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8A3FFC]"
                >
                  {loggingIn ? (
                    <Loader size="1.5em" className="text-white animate-spin" />
                  ) : (
                    "Log in"
                  )}
                </button>
              </div>
            </form>

            {/* Register Link */}
            <p className="mt-6 text-center text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-purple-300 hover:text-purple-200"
              >
                Register here
              </Link>
            </p>

            {/* Social Login Options (Optional) */}
            {/* <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div>
                  <a
                    href="#"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Sign in with Facebook</span>
                    {/* Facebook Icon */}
            {/* </a>
                </div>
                <div>
                  <a
                    href="#"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Sign in with Google</span>
                    {/* Google Icon */}
            {/* </a>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
