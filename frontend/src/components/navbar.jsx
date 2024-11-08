import { Sparkles } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axios";
const Navbar = () => {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const handleLogout = async (e) => {
    setLoggingOut(true);
    try {
      e.preventDefault();
      await axios.get("/sanctum/csrf-cookie");
      const response = await axios.post("/logout");
      console.log(response);
      if (response.status < 300) {
        setLoggingOut(false);
      }
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      setLoggingOut(false);
      console.error("Logout error:", err);
    }
  };
  return (
    <nav className="text-white mt-7 w-full justify-center align-center flex">
      <div className="w-fit gap-x-10 bg-gradient-to-r flex justify-around items-center from-[#04071D]  to-[#0C0E23] rounded-2xl p-4 border-[#6971A2]  border-opacity-30 border-2">
        <h1 className="text-2xl font-bold">
          Spend<span className="text-[#CBACF9]">Sage</span>
        </h1>
        <ul className="flex gap-3">
          <li className="hover:text-[#CBACF9] font-medium transition duration-300 ease-in-out">
            <Link to="/">Dashboard</Link>
          </li>
          <li className="hover:text-[#CBACF9] font-medium transition duration-300 ease-in-out">
            <Link to="/analysis">Analysis</Link>
          </li>
          <li className="hover:text-[#CBACF9] flex gap-x-1 font-medium transition duration-300 ease-in-out">
            <Link to="/ai-analysis">AI Analysis </Link>
            <Sparkles width={20} />
          </li>
          <li className="hover:text-[#CBACF9] font-medium transition duration-300 ease-in-out">
            <button onClick={handleLogout} className="bg-transparent">
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
