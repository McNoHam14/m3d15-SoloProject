import mongoose from mongoose
const { Schema, model } = mongoose

const min = 0
const max = 5

const reviewsSchema = new Schema(
    {
        "comment": {type: String, required: true},
        "rate": {type: Number, min:min, max: max, required: true}
    },
    {
    timestamps: true,
    } 
)

model("Review", reviewsSchema)