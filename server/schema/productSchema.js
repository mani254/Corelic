const mongoose = require('mongoose')
const slugify = require('slugify');

const productSchema = mongoose.Schema({
   title: {
      type: String,
      required: [true, 'Title is required'],
      unique: [true, 'Title is already existed'],
      maxlength: [60, 'Title should be less than 60 characters'],
      trim: true,
   },
   slug: {
      type: String,
      unique: true,
      lowercase: true,
   },
   overview: {
      type: String,
      required: [true, 'overview is required'],
      maxlength: [450, 'overview should be less than 450 characters'],
      trim: true
   },
   description: {
      type: String,
      trim: true
   },
   vendor: {
      type: String,
      // type: mongoose.Schema.Types.ObjectId,
      // ref: 'Vendors',
   },
   price: {
      type: Number,
      required: true,
      min: 0,
   },
   comparePrice: {
      type: Number,
      required: true,
      min: 0,
      validate: {
         validator: function (v) {
            return v >= this.price;
         },
         message: 'Compare price should be greater than or equal to the actual price'
      }
   },

   gst: {
      type: Number,
      min: 0
   },
   sku: {
      type: Number,
      required: true,
      unique: true
   },
   status: {
      type: String,
      enum: ["draft", "active", "inactive"],
      default: "Draft"
   },

   images: {
      type: [
         {
            path: { type: String, trim: true },
            alt: { type: String, trim: true }
         }
      ],
      default: [],
      _id: false
   },
   trackInventory: {
      type: Boolean,
      default: false
   },
   stock: {
      type: Number,
      required: true,
      min: 0
   },
   options: {
      type: [
         {
            name: { type: String, required: true, trim: true },
            stock: { type: Number, required: true, min: 0 }
         }
      ],
      default: [],
      _id: false,
   },


   metaData: {
      metaTitle: {
         type: String,
         trim: true
      },
      metaDescription: {
         type: String,
         trim: true
      }
   }
},
   { timestamps: true }
);


productSchema.pre('validate', function (next) {
   if (this.isModified('title')) {
      this.slug = slugify(this.title, { lower: true, strict: true });
   }

   if (this.images && this.images.length > 0) {
      this.images = this.images.map((image) => ({
         path: image.path,
         alt: image.alt ? image.alt : this.title,
      }));
   }

   next();
});


const Product = mongoose.model('Product', productSchema)

module.exports = Product