import { CheckCircle } from "lucide-react";
import axios from "../../axios";
const PaymentSuccessMessage = ({ amount }) => {
  const handlePremiumAccess = async () => {
    try {
      axios
        .post(
          "/giveUserPremium",
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          window.location.reload();
        });
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-4">
          Thank you for your payment of ₹{amount}
        </p>
        =
        <button
          onClick={() => handlePremiumAccess()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessMessage;
