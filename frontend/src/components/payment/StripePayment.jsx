import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(
  "pk_test_51QFVigJMQO5xHwDBFlNmx6DYujK9zwCJY6YaKMpKRb0huHaUV8VlQJXdCUGrPJr6qB1dHvQUQfM1i64yNaSCVyRx00COJnbMSN"
); // Your Publishable Key

function StripePayment({ clientSecret, onPaymentSuccess }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        clientSecret={clientSecret}
        onPaymentSuccess={onPaymentSuccess}
      />
    </Elements>
  );
}

export default StripePayment;
