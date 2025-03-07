import mongoose from "mongoose";
export {};

const paycheck_schema = new mongoose.Schema(
  {
    affiliate: { type: mongoose.Schema.Types.ObjectId, ref: "Affiliate" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    promo_code: { type: mongoose.Schema.Types.ObjectId, ref: "Promo" },
    amount: { type: Number },
    revenue: { type: Number },
    earned: { type: Number },
    uses: { type: Number },
    venmo: { type: String },
    stripe_connect_id: { type: String },
    paid: { type: Boolean },
    paid_at: { type: Date },
    reciept: { type: String },
    deleted: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

const paycheck_model = mongoose.model("Paycheck", paycheck_schema);

export default paycheck_model;
