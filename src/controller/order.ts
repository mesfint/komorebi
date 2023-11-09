import { Request, Response } from "express";
import Order from "../models/order";
import { IOrder, IOrderItem } from "../types";
import stripe from "stripe";

const stripeClient = new stripe(
  "sk_test_51O9thpD1OdIuxkgPpZSSvoropQ5d8Nnbs44J2gNNd1l0LEumXzfw2Ns2fAhbIDohOxKSzTCBeZ955rzBCGVHDPB100my5ssXmJ",
  {
    apiVersion: "2023-10-16",
  }
);

type CreateOrderType = Pick<
  IOrder,
  "deliveryAddress" | "totalPrice" | "user" | "orderItems"
>;

const BASE_UNIT = 100;

const getTotalAmount = (orderItems: IOrderItem[]) => {
  return (
    orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0) *
    BASE_UNIT
  );
};

/**
 *
 * @param request
 * @param response
 *
 * 1. To make a request to stripe, it's gonna return paymentIntent,we've to pass currency and order amount
 * 2. Save paymentIntentId in order model
 * 3. Return paymentIntentId.client_secret
 *
 */

export const createOrder = async (request: Request, response: Response) => {
  try {
    const { deliveryAddress, orderItems, totalPrice, user }: CreateOrderType =
      request.body;

    const totalAmount = getTotalAmount(orderItems);

    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: totalAmount,
      currency: "usd",
    });

    const order = await Order.create({
      user,
      deliveryAddress,
      orderItems,
      totalPrice,
      paymentIntentId: paymentIntent.id,
      paymentStatus: "pending",
      paymentDetails: {},
    });
    response.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log("error in createOrder", error);
    response.send({
      message: "Something went wrong in create order",
    });
    throw error;
  }
};
