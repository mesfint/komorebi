import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectToDB } from "./db";
import { productRouter } from "./routes/product";
import { orderRouter } from "./routes/order";
import { webhookHandler } from "./webhook";

dotenv.config();

const app = express();
app.use(cors());

connectToDB();

app.get("/", (req, res) => {
  res.status(200).send("Hello, World!"); // You should send a response to the client
});

app.post("/webhook", express.raw({ type: "application/json" }), webhookHandler);

app.use(express.json()); //!important, It parses the incoming request, without this incoming requests are not working
app.use("/api/v1/products", productRouter);
app.use("/api/v1/orders", orderRouter);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("Server connected at port " + PORT);
});
