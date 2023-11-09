import { Response, Request } from "express";
import stripe from "stripe";
import Order from "../models/order";

const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export const webhookHandler = async (req: Request, res: Response) => {
  try {
    const sig = req.headers["stripe-signature"] as string;
    let event = stripeClient.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
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
    res.send({ received: true });
  } catch (error) {
    console.log("error in webhookHandler", error);
    throw error;
  }
};
