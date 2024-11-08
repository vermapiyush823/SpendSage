import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useRef, useState } from "react";
import PaymentSuccessMessage from "./PaymentSuccessMessage";
const CheckoutForm = ({ clientSecret, amount = "1,000.00" }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const formRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleSubmit = async (event) => {
      event.preventDefault();
      if (!stripe || !elements) return;

      setLoading(true);

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name,
              email,
            },
          },
        }
      );

      if (error) {
        console.error(error);
        setErrorMessage(error.message);
        setLoading(false);
      } else if (paymentIntent.status === "succeeded") {
        setIsPaymentSuccessful(true);
      }
      setLoading(false);
    };

    const formElement = formRef.current;
    formElement.addEventListener("submit", handleSubmit);

    return () => {
      formElement.removeEventListener("submit", handleSubmit);
    };
  }, [stripe, elements, clientSecret, email, name]);

  return (
    <div className="w-full max-w-xl mx-auto p-6">
      {isPaymentSuccessful ? (
        <PaymentSuccessMessage amount={amount} />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-8">
            <div className="text-lg text-gray-500">AI Analysis</div>
            <div className="text-3xl font-medium">₹{amount}</div>
          </div>
          <button className="w-full bg-black text-white rounded-md py-3 mb-6 flex items-center justify-center gap-2">
            Pay with Apple Pay
          </button>

          <div className="relative text-center mb-6">
            <hr className="border-gray-200" />
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-gray-500">
              Or pay with card
            </span>
          </div>

          <form ref={formRef} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Email address"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-gray-700">
                Card information
              </label>
              <div className="border border-gray-300 rounded-md">
                <CardElement
                  className="w-full px-3 py-2"
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": {
                          color: "#aab7c4",
                        },
                      },
                      invalid: {
                        color: "#9e2146",
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-gray-700">
                Cardholder name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Full name on card"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!stripe || loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Pay"}
            </button>
          </form>

          <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
            <div className="flex justify-center items-center gap-1">
              <span>Powered by</span>
              <svg
                focusable="false"
                width={33}
                height={15}
                className="mt-1"
                role="img"
              >
                <g
                  fillRule="evenodd"
                  className="fill-current text-gray-400 hover:text-gray-800"
                >
                  <path d="M32.956 7.925c0-2.313-1.12-4.138-3.261-4.138-2.15 0-3.451 1.825-3.451 4.12 0 2.719 1.535 4.092 3.74 4.092 1.075 0 1.888-.244 2.502-.587V9.605c-.614.307-1.319.497-2.213.497-.876 0-1.653-.307-1.753-1.373h4.418c0-.118.018-.588.018-.804zm-4.463-.859c0-1.02.624-1.445 1.193-1.445.55 0 1.138.424 1.138 1.445h-2.33zM22.756 3.787c-.885 0-1.454.415-1.77.704l-.118-.56H18.88v10.535l2.259-.48.009-2.556c.325.235.804.57 1.6.57 1.616 0 3.089-1.302 3.089-4.166-.01-2.62-1.5-4.047-3.08-4.047zm-.542 6.225c-.533 0-.85-.19-1.066-.425l-.009-3.352c.235-.262.56-.443 1.075-.443.822 0 1.391.922 1.391 2.105 0 1.211-.56 2.115-1.39 2.115zM18.04 2.766V.932l-2.268.479v1.843zM15.772 3.94h2.268v7.905h-2.268zM13.342 4.609l-.144-.669h-1.952v7.906h2.259V6.488c.533-.696 1.436-.57 1.716-.47V3.94c-.289-.108-1.346-.307-1.879.669zM8.825 1.98l-2.205.47-.009 7.236c0 1.337 1.003 2.322 2.34 2.322.741 0 1.283-.135 1.581-.298V9.876c-.289.117-1.716.533-1.716-.804V5.865h1.716V3.94H8.816l.009-1.96zM2.718 6.235c0-.352.289-.488.767-.488.687 0 1.554.208 2.241.578V4.202a5.958 5.958 0 0 0-2.24-.415c-1.835 0-3.054.957-3.054 2.557 0 2.493 3.433 2.096 3.433 3.17 0 .416-.361.552-.867.552-.75 0-1.708-.307-2.467-.723v2.15c.84.362 1.69.515 2.467.515 1.879 0 3.17-.93 3.17-2.548-.008-2.692-3.45-2.213-3.45-3.225z" />
                </g>
              </svg>
            </div>
            <div>
              <span className="mx-2">|</span>
              <a href="#" className="text-gray-600 hover:text-gray-800">
                Terms
              </a>
              <span className="mx-2">|</span>
              <a href="#" className="text-gray-600 hover:text-gray-800">
                Privacy
              </a>
            </div>
          </div>
          <div>
            {errorMessage && (
              <div className="text-red-600 text-center text-sm text-bold mt-2">
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;
