// src/components/Signup.js

import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../axios.js";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [registering, setRegisteringIn] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const { name, email, password, password_confirmation } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300); // Adjust the timing as needed

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");
    try {
      // Step 1: Fetch CSRF token
      setRegisteringIn(true);
      await axios.get("/sanctum/csrf-cookie");
      // Step 2: Make registration request
      const response = await axios
        .post("/register", { email, name, password, password_confirmation })
        .then((res) => res.data);
      if (response.user != null) {
        setRegisteringIn(false);
        localStorage.setItem("token", response.token);
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response && err.response.data.errors) {
        setErrors(err.response.data.errors);
        setRegisteringIn(false);
      } else {
        setErrors({ general: ["An error occurred. Please try again."] });
        setRegisteringIn(false);
      }
    }
  };

  return (
    <div
      className="min-h-screen 
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
          className="relative  px-16 pb-20 pt-10  h-[620px]
        border-2 border-[#161A31] bg-[#04071D]
         shadow-lg sm:rounded-3xl "
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
                Create Your Account
              </h1>
              <p className="mt-2 text-sm text-gray-300">
                Join us today and start managing your expenses efficiently.
              </p>
            </div>

            {/* Error Message */}
            {errors.general && (
              <div
                className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{errors.general[0]}</span>
              </div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="sr-only">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 rounded-md border ${
                    errors.name ? "border-red-500" : "border-[#161A31]"
                  } bg-gray-900 text-white focus:outline-none border-2 border-[#161A31]`}
                  placeholder="Name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
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
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 rounded-md border ${
                    errors.email ? "border-red-500" : "border-[#161A31]"
                  } bg-gray-900 text-white focus:outline-none border-2 border-[#161A31]`}
                  placeholder="Email address"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
                )}
              </div>

              <div className="flex w-full gap-x-2">
                {/* Password Field */}
                <div className="w-1/2">
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={handleChange}
                    className={`inline-block w-full px-4 py-3 rounded-md border ${
                      errors.password ? "border-red-500" : "border-[#161A31]"
                    } bg-gray-900 text-white focus:outline-none border-2 border-[#161A31]`}
                    placeholder="Password"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password[0]}
                    </p>
                  )}
                </div>

                {/* Password Confirmation Field */}
                <div className="w-1/2">
                  <label htmlFor="password_confirmation" className="sr-only">
                    Confirm Password
                  </label>
                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password_confirmation}
                    onChange={handleChange}
                    className={`inline-block w-full  px-4 py-3 rounded-md border ${
                      errors.password_confirmation
                        ? "border-red-500"
                        : "border-[#161A31]"
                    } bg-gray-900 text-white focus:outline-none border-2 border-[#161A31]`}
                    placeholder="Confirm Password"
                  />
                  {errors.password_confirmation && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password_confirmation[0]}
                    </p>
                  )}
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
                  {registering ? (
                    <Loader size="1.5em" className="text-white animate-spin" />
                  ) : (
                    "Sign up"
                  )}
                </button>
              </div>
            </form>

            {/* Link to Login */}
            <p className="mt-6 text-center text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-purple-300 hover:text-purple-200"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Signup;
