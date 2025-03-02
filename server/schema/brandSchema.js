const mongoose = require('mongoose');
const slugify = require('slugify');

const brandSchema = mongoose.Schema(
   {
      title: {
         type: String,
         required: [true, 'Title is required'],
         unique: [true, 'Title already exists'],
         maxlength: [60, 'Title should be less than 60 characters'],
         trim: true,
      },
      slug: {
         type: String,
         unique: true,
         lowercase: true,
      },
      description: {
         type: String,
         maxlength: [450, 'Description should be less than 450 characters'],
         trim: true,
      },
      metaData: {
         metaTitle: {
            type: String,
            trim: true,
         },
         metaDescription: {
            type: String,
            trim: true,
         },
      },
   },
   { timestamps: true }
);

brandSchema.pre('validate', function (next) {
   if (this.isModified('title')) {
      this.slug = slugify(this.title, { lower: true, strict: true });
   }
   next();
});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
