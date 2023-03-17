import Express from "express";
import uniqid from "uniqid";
import { getReviews, writeReviews } from "../../lib/fs-tools.js";

const reviewsRouter = Express.Router();

reviewsRouter.post("/:productId/reviews", async (req, res, next) => {
  const newReview = {
    ...req.body,
    productId: req.params.productId,
    createdAt: new Date(),
    updatedAt: new Date(),
    id: uniqid(),
  };
  //   console.log(newReview);

  const reviews = await getReviews();
  reviews.push(newReview);
  await writeReviews(reviews);

  res.send(newReview);
});

export default reviewsRouter;
