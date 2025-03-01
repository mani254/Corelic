const mongoose = require('mongoose')
const slugify = require('slugify')

const collectionSchema = mongoose.Schema({
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
      lowercase: true
   },
   description: {
      type: String,
      required: [true, 'overview is required'],
      maxlength: [450, 'overview should be less than 450 characters'],
      trim: true
   },
   status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
   },
   image: {
      type: {
         path: { type: String, trim: true },
         alt: { type: String, trim: true }
      },
      default: {},
      _id: false
   },
   showInHome: {
      type: Boolean,
      default: false,
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
)

collectionSchema.pre('validate', function (next) {
   if (this.isModified('title')) {
      this.slug = slugify(this.title, { lower: true, strict: true })
   }
   if (this.image) {
      this.image = { path: this.image.path, alt: this.image.alt ? this.image.alt : this.title }
   }
   next()
});

const Collection = mongoose.model('Collection', collectionSchema)

module.exports = Collection