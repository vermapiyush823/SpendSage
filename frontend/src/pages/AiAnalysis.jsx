import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import DummmyImage from "../assets/image.png";
import axios from "../axios";
import PredictiveSpending from "../components/charts/PredictiveSpending";
import CustomPrompt from "../components/CustomPrompt";
import CheckoutForm from "../components/payment/CheckoutForm"; // Import CheckoutForm
import Suggestions from "../components/Suggestions";

const AiAnalysis = () => {
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false);
  const [clientSecret, setClientSecret] = useState(null); // State to store client_secret
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  useEffect(() => {
    const fetchPremiumStatus = async () => {
      const response = await axios.get("/hasUserPremium", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setHasPremiumAccess(response.data.has_premium);
    };
    fetchPremiumStatus();
  }, []);

  const handlePremiumAccess = async () => {
    try {
      const { data } = await axios.post(
        "/stripe/payment",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setClientSecret(data.client_secret); // Set client_secret
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed");
    }
  };

  const onPaymentSuccess = () => {
    setHasPremiumAccess(true); // Update premium access state
    setClientSecret(null); // Clear client_secret after payment
  };

  return (
    <div>
      {hasPremiumAccess ? (
        <div className="text-center text-white mt-10 w-full">
          <h1 className="text-4xl text-[#CBACF9] font-semibold text-center mt-10 mb-5">
            AI Analysis
          </h1>
          <div className="flex flex-col justify-between gap-5 p-9">
            <div className="flex gap-5">
              <PredictiveSpending />
              <Suggestions />
            </div>
            <CustomPrompt />
          </div>
        </div>
      ) : clientSecret ? (
        // Show CheckoutForm if clientSecret is set
        <div className="flex justify-center items-center mt-10">
          <Elements stripe={stripePromise}>
            <CheckoutForm clientSecret={clientSecret} />
          </Elements>
        </div>
      ) : (
        <div className="relative flex no-wrap flex-nowrap justify-center p-20 mt-10">
          {/* Blurred overlay for the AI insights preview */}
          <div className="absolute inset-0 bg-white bg-opacity-30 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <p className="text-2xl font-bold text-center bg-gradient-to-r from-white via-[#CBACF9] to-white bg-clip-text text-transparent">
                Unlock AI Insights
              </p>
              <Sparkles size={40} color="#CBACF9" />
            </div>
            <button
              className="w-fit bg-gradient-to-r from-[#c3a2f4] to-[#8A3FFC] text-white px-6 py-2 rounded-lg hover:from-[#8A3FFC] hover:to-[#c3a2f4] transition duration-200 ease-in-out"
              onClick={handlePremiumAccess}
            >
              Buy to See AI Insights
            </button>
          </div>

          {/* AI Insights content (blurred behind the overlay) */}
          <div className="flex flex-wrap justify-center gap-4 p-6 opacity-30 pointer-events-none">
            <div className="bg-gray-200 p-4 rounded shadow">
              <h2 className="text-lg font-bold text-gray-700">
                Predicted Expenses
              </h2>
              <p className="mt-2 text-gray-600">
                A preview of future expense predictions...
              </p>
            </div>
            <div className="bg-gray-200 p-4 rounded shadow">
              <h2 className="text-lg font-bold text-gray-700">
                Spending Anomalies
              </h2>
              <p className="mt-2 text-gray-600">
                Detect unusual spending patterns...
              </p>
            </div>
            <div className="bg-gray-200 p-4 rounded shadow">
              <h2 className="text-lg font-bold text-gray-700">
                Monthly Insights
              </h2>
              <p className="mt-2 text-gray-600">
                Overview of monthly spending insights...
              </p>
            </div>
            <img src={DummmyImage} alt="AI Insights" className="w-1/2" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AiAnalysis;
