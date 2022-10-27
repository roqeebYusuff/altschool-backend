const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
      required: false,
    },
    state: {
      type: String,
      required: true,
    },
    read_count: {
      type: Number,
      required: true,
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
    },
    status: {
      type: String,
      enum: Object.values(blogStatus),
      default: blogStatus.draft,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(COLLECTION_NAME, blogSchema);
