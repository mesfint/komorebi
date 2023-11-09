import express from "express";
import { createOrder } from "../controller/order";

export const orderRouter = express.Router();

orderRouter.post("/", createOrder);
