import mongoose, { Schema } from "mongoose";
import { IProduct } from "../types";

const productSchema = new Schema<IProduct>(
  //Mongoose will take of the ID
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, //creating and updating can be retrieved by mongo timestamp
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
