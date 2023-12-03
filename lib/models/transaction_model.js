const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    products: {
      type: [
        {
          product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
        },
      ],
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    employee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Transaction", schema);
