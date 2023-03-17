import Express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";

import productsRouter from "./api/products/index.js";
import { join, dirname, extname } from "path";
import { fileURLToPath } from "url";

const server = Express();
const port = process.env.PORT || 3001;

// Global middlewares

server.use(cors());
server.use(Express.json());

const imagesFolderPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "./public/images"
);

server.use(Express.static(imagesFolderPath));

// Endpoints

server.use("/products", productsRouter);

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to MongoDB!");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is running on ${port}`);
  });
});
