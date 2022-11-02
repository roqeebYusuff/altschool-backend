const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const COLLECTION_NAME = "blogs";
const blogStatus = {
  draft: "draft",
  published: "published",
};

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: false,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    state: {
      type: String,
      enum: Object.values(blogStatus),
      default: blogStatus.draft,
      required: true,
    },
    read_count: {
      type: Number,
      required: true,
      default: 0,
    },
    reading_time: {
      type: Number,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

/* Validator  */
blogSchema.plugin(uniqueValidator);
//paginate
blogSchema.plugin(mongoosePaginate);

module.exports = mongoose.model(COLLECTION_NAME, blogSchema);
