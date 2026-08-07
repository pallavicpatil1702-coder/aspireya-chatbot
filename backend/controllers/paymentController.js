import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "test_key",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "test_secret",
});

export const createOrder = async (req, res) => {
    try {
        const { amount } = req.body; 

        if (!amount) {
            return res.status(400).json({ error: "Amount is required" });
        }

        const options = {
            amount: amount * 100, // Amount in paise
            currency: "INR",
            receipt: `receipt_order_${Math.floor(Math.random() * 1000)}`,
        };

        const order = await razorpayInstance.orders.create(options);
        
        if (!order) {
            return res.status(500).json({ error: "Some error occurred while creating Razorpay order" });
        }

        res.json(order);
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            userId,
            purpose // e.g. "chatbot_limit" or "premium_report_X"
        } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "test_secret")
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // TODO: Yahan par database update karna hai
            // Agar purpose == "chatbot_limit" toh user limit increase karein
            // Agar purpose == "premium_report" toh report access allow karein

            return res.status(200).json({ 
                success: true, 
                message: "Payment verified successfully",
                userId: userId,
                purpose: purpose
            });
        } else {
            return res.status(400).json({ success: false, message: "Invalid signature sent!" });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
};
