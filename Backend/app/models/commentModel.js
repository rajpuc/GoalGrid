import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      maxlength: 300,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roadmapItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoadmapItem",
      required: true,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    depth: {
      type: Number,
      default: 0,
      max: 2,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const commentModel = mongoose.model("Comment", commentSchema);
export default commentModel;
