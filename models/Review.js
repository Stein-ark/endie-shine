import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to a product"],
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a customer"],
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Review must be linked to an order"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    title: {
      type: String,
      required: [true, "Review title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    body: {
      type: String,
      required: [true, "Review body is required"],
      trim: true,
      maxlength: [1000, "Review cannot exceed 1000 characters"],
    },
    verifiedPurchase: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// A customer can only leave one review per product per order
// This prevents the same customer from reviewing the same product twice
ReviewSchema.index({ product: 1, customer: 1, order: 1 }, { unique: true });

// This runs automatically after a review is saved
// It updates the product's averageRating and totalReviews fields
ReviewSchema.post("save", async function () {
  const Product = mongoose.model("Product");

  const result = await mongoose.model("Review").aggregate([
    {
      $match: { product: this.product },
    },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await Product.findByIdAndUpdate(this.product, {
      averageRating: Math.round(result[0].averageRating * 10) / 10,
      totalReviews: result[0].totalReviews,
    });
  }
});

const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);

export default Review;