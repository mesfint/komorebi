import { Response, Request } from "express";
import stripe from "stripe";
import Order from "../models/order";

const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export const webhookHandler = async (req: Request, res: Response) => {
  try {
    // Extract Stripe signature from request headers
    const sig = req.headers["stripe-signature"] as string;

    // Construct the Stripe webhook event
    let event = stripeClient.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    // Handle different webhook event types
    if (event.type === "charge.succeeded") {
      const charge = event.data.object as stripe.Charge;
      const order = await Order.findOne({
        paymentIntentId: charge.payment_intent,
      });
      if (order) {
        order.paymentStatus = "paid";
        order.paymentDetails = charge;
        await order.save();
      }
    } else if (event.type === "charge.failed") {
      // Handle failed charge event

      const charge = event.data.object as stripe.Charge;
      const order = await Order.findOne({
        paymentIntentId: charge.payment_intent,
      });
      if (order) {
        order.paymentStatus = "failed";
        order.paymentDetails = charge;
        await order.save();
      }
    }
    // Send a response indicating successful processing of the webhook event

    res.send({ received: true });
  } catch (error) {
    // Handle and log any errors that occur during webhook processing
    console.log("error in webhookHandler", error);
    throw error;
  }
};
