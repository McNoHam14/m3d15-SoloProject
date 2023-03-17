import mongoose

const { Schema, model } from "mongoose";

const reviewsSchema = new Schema(
    {
        "comment": "A good book but definitely I don't like many parts of the plot", //REQUIRED
        "rate": 3, //REQUIRED, max 5
    },
    {
    timestamps: true,
    } 
)

model("Review", reviewsSchema)