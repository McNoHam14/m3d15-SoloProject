import mongoose from "mongoose";

const { Schema, model } = mongoose;

const productsSchema = new Schema(
  {
    name: "app test 1", //REQUIRED
    description: "somthing longer", //REQUIRED
    brand: "nokia", //REQUIRED
    imageUrl:
      "https://drop.ndtv.com/TECH/product_database/images/2152017124957PM_635_nokia_3310.jpeg?downsize=*:420&output-quality=80", //REQUIRED
    price: 100, //REQUIRED
    category: "smartphones",
    reviews: [String],
  },
  {
    timestamps: true,
  }
);

model("Product", productsSchema);
