import mongoose from "mongoose";

const WithdrawalSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Withdrawal must belong to a vendor"],
    },
    amount: {
      type: Number,
      required: [true, "Withdrawal amount is required"],
      min: [1000, "Minimum withdrawal is ₦1,000"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "paid"],
      default: "pending",
    },
    bankDetails: {
      bankName: {
        type: String,
        required: [true, "Bank name is required"],
      },
      accountNumber: {
        type: String,
        required: [true, "Account number is required"],
      },
      accountName: {
        type: String,
        required: [true, "Account name is required"],
      },
    },
    adminNote: {
      type: String, // admin can leave a note when approving or rejecting
    },
    paidAt: {
      type: Date, // timestamp of when admin actually sent the money
    },
  },
  {
    timestamps: true,
  }
);

const Withdrawal =
  mongoose.models.Withdrawal ||
  mongoose.model("Withdrawal", WithdrawalSchema);

export default Withdrawal;