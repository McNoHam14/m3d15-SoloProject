import Express from "express";
import { getReviews, writeReviews } from "../../lib/fs-tools.js";

const reviewsRouter = Express.Router();

reviewsRouter.post("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

reviewsRouter.get("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

reviewsRouter.get("/:reviewId", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

reviewsRouter.put("/:reviewId", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

reviewsRouter.delete("/:reviewId", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

export default reviewsRouter;
