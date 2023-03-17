import Express from "Express";
import createHttpError from "http-errors";
import ProductsModel from "../model.js";
import q2m from "query-to-mongo";

const productsRouter = Express.Router();

productsRouter.post("/", async (req, res, next) => {
  try {
    const newProducts = new ProductsModel(req.body);
    const { _id } = await newProducts.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/", async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice } = req.query;
    console.log(req.query);
    const filter = {};
    if (category) {
      filter.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};

      if (minPrice !== undefined) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice !== undefined) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    const mongoQuery = q2m({ ...req.query });

    const products = await ProductsModel.find(filter, mongoQuery.options.fields)
      .limit(mongoQuery.options.limit)
      .skip(mongoQuery.options.skip)
      .sort(mongoQuery.options.sort)
      .populate("reviews");

    const total = await ProductsModel.countDocuments(filter);
    const numberOfPages = Math.ceil(total / mongoQuery.options.limit);

    res.send({
      links: mongoQuery.links("http://localhost:3001/products", total),
      total,
      numberOfPages,
      products,
    });
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await ProductsModel.findById(req.params.productId);
    if (product) {
      res.send(product);
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
    const updatedProduct = await ProductsModel.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedProduct) {
      res.send(updatedProduct);
    } else {
      createHttpError(
        next(404, `Product with id ${req.params.productId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const deletedProduct = await ProductsModel.findByIdAndDelete(
      req.params.productId
    );
    if (deletedProduct) {
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

productsRouter.post("/:productId/reviews", async (req, res, next) => {
  try {
    const review = req.body;
    const product = await ProductsModel.findByIdAndUpdate(
      req.params.productId,
      { $push: { reviews: review } },
      { new: true, runValidators: true }
    );
    if (product) {
      res.status(201).send();
    } else {
      next(createHttpError(404, `No product with id ${req.params.productId}`));
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId/reviews", async (req, res, next) => {
  try {
    const review = await ProductsModel.findById(req.params.productId);
    if (review) {
      res.send(review.reviews);
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

productsRouter.get("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const review = await ProductsModel.findById(req.params.productId);
    if (review) {
      const singleReview = review.reviews.find(
        (review) => review._id.toString() === req.params.reviewId
      );
      if (singleReview) {
        res.send(singleReview);
      } else {
        next(
          createHttpError(
            404,
            `Product with id ${req.params.reviewId} not found`
          )
        );
      }
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.put("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const review = await ProductsModel.findById(req.params.productId);
    if (review) {
      const index = review.reviews.findIndex(
        (review) => review._id.toString() === req.params.reviewId
      );
      if (index !== -1) {
        review.reviews[index] = {
          ...review.reviews[index].toObject(),
          ...req.body,
        };
        await review.save();
        res.send(review);
      } else {
        next(
          createHttpError(
            404,
            `Product with id ${req.params.reviewId} not found`
          )
        );
      }
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.delete(
  "/:productId/reviews/:reviewId",
  async (req, res, next) => {
    try {
      const review = await ProductsModel.findByIdAndUpdate(
        req.params.productId,
        { $pull: { reviews: { _id: req.params.reviewId } } },
        { new: true, runValidators: true }
      );
      if (review) {
        res.send(review);
      } else {
        next(
          createHttpError(
            404,
            `Product with id ${req.params.reviewId} not found`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default productsRouter;

// import multer from "multer";

// const imagesFolderPath = join(
//   dirname(fileURLToPath(import.meta.url)),
//   "../../public/images"
// );

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, imagesFolderPath);
//   },
//   filename: function (req, file, cb) {
//     const ext = extname(file.originalname);
//     cb(null, req.params.id + ext);
//   },
// });

// const upload = multer({ storage: storage });
