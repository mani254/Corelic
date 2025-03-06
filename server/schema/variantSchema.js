const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema(
   {
      products: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products",
            required: true,
         }
      ]
   },
   { timestamps: true }
);

const Variant = mongoose.model("Variant", variantSchema);

module.exports = Variant;
