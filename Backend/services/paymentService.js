
const Razorpay = require("razorpay");
const crypto = require("crypto");

const getRazorpayClient = () => {
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay environment variables are missing");
  }

  return new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });
};

const createPaymentOrder = async ({
  amount,
  bookingId,
  currency = "INR",
}) => {
  if (!Number.isSafeInteger(amount) || amount <= 0) {
    throw new Error("Amount must be a positive integer in paise");
  }

  if (!bookingId) {
    throw new Error("Booking ID is required");
  }

  const razorpay = getRazorpayClient();

  return razorpay.orders.create({
    amount,
    currency,
    receipt: `booking_${bookingId}`,
    notes: {
      bookingId: bookingId.toString(),
    },
  });
};

const verifyPaymentSignature = ({
  orderId,
  paymentId,
  signature,
}) => {
  if (!orderId || !paymentId || !signature) {
    return false;
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;

  if (!secret) {
    throw new Error("RAZORPAY_KEY_SECRET is not configured");
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const expectedBuffer = Buffer.from(expectedSignature, "hex");
  const receivedBuffer = Buffer.from(signature, "hex");

  if (
    expectedBuffer.length !== receivedBuffer.length ||
    receivedBuffer.length === 0
  ) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
};

module.exports = {
  createPaymentOrder,
  verifyPaymentSignature,
};
