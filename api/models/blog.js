const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const COLLECTION_NAME = "blog";
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
      type: String,
      required: true,
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
      default: 0
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

module.exports = mongoose.model(COLLECTION_NAME, blogSchema);
