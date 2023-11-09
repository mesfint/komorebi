import { Request, Response } from "express";
import { IProduct } from "../types";
import Product from "../models/product";

type CreateProductType = Pick<
  IProduct,
  "image" | "name" | "price" | "description"
>;

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { image, name, price, description }: CreateProductType = req.body;

    const product = await Product.create({
      image,
      name,
      price,
      description,
    });
    res.send(product);
  } catch (error) {
    console.log("error in product", error);
    res.send({ message: "Something went wrong!!" });
    throw error;
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({});
    res.send(products);
  } catch (error) {
    console.log("Something is wrong", error);
    throw error;
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.send(product);
  } catch (error) {
    console.log("Something is wrong", error);
    throw error;
  }
};
