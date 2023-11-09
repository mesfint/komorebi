import express from "express";
import {
  createProduct,
  getProductById,
  getProducts,
} from "../controller/product";

export const productRouter = express.Router();

productRouter.get("/", getProducts);
productRouter.get("/:id", getProductById);
productRouter.post("/", createProduct);
