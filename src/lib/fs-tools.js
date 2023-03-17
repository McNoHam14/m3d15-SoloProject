import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON } = fs;

const dataFolderPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../data/"
);
console.log("A.", dataFolderPath);

export const productsJSONPath = join(dataFolderPath, "products.json");
console.log("B.", productsJSONPath);

export const getProducts = () => readJSON(productsJSONPath);
export const writeProducts = (productsArray) =>
  writeJSON(productsJSONPath, productsArray);

export const reviewsJSONPath = join(dataFolderPath, "reviews.json");
console.log("C.", reviewsJSONPath);

export const getReviews = () => readJSON(reviewsJSONPath);
export const writeReviews = (reviewsArray) =>
  writeJSON(reviewsJSONPath, reviewsArray);
