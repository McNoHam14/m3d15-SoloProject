import Express from "express";
import fs from "fs-extra";
import uniqid from "uniqid";
import {
  getProducts,
  writeProducts,
  productsJSONPath,
} from "../../lib/fs-tools.js";
import { join, dirname, extname } from "path";
import { fileURLToPath } from "url";
import createHttpError from "http-errors";
import multer from "multer";

const imagesFolderPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../public/images"
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagesFolderPath);
  },
  filename: function (req, file, cb) {
    const ext = extname(file.originalname);
    cb(null, req.params.id + ext);
  },
});

const upload = multer({ storage: storage });

const productsRouter = Express.Router();

productsRouter.post("/", async (req, res) => {
  console.log("C", req.body);
  const newProduct = {
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date(),
    id: uniqid(),
  };

  const productsArray = await getProducts();
  productsArray.push(newProduct);
  await writeProducts(productsArray);

  res.status(201).send({ id: newProduct.id });
});

productsRouter.get("/", async (req, res, next) => {
  try {
    let products = await getProducts();
    products = products.map((product) => {
      return {
        name: product.name,
        brand: product.brand,
      };
    });
    res.send(products);
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const productsArray = await getProducts();

    const foundProduct = productsArray.find(
      (product) => product.id === req.params.productId
    );
    if (foundProduct) {
      res.send(foundProduct);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const productsArray = await getProducts();

    const index = productsArray.findIndex(
      (product) => product.id === req.params.productId
    );
    if (index !== -1) {
      const oldProduct = productsArray[index];

      const updatedProduct = {
        ...oldProduct,
        ...req.body,
        updatedAt: new Date(),
      };

      productsArray[index] = updatedProduct;

      await writeProducts(productsArray);

      res.send(updatedProduct);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const productsArray = await getProducts();

    const remainingProducts = productsArray.filter(
      (product) => product.id !== req.params.productId
    );

    if (productsArray.length !== remainingProducts.length) {
      await writeProducts(remainingProducts);

      res.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.post(
  "/:id/upload",
  upload.single("image"),
  async (req, res, next) => {
    const imageUrl = `http://localhost:3009/${req.params.id}${extname(
      req.file.originalname
    )}`;

    // console.log(imageUrl);

    // res.send("Hello World!");

    const productsArray = await getProducts();

    const index = productsArray.findIndex(
      (product) => product.id === req.params.id
    );
    if (index !== -1) {
      const oldProduct = productsArray[index];

      const updatedProduct = {
        ...oldProduct,
        imageUrl,
        updatedAt: new Date(),
      };

      productsArray[index] = updatedProduct;

      await writeProducts(productsArray);

      res.send(updatedProduct);
    }
  }
);

export default productsRouter;
