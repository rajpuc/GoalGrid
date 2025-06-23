import mongoose from "mongoose";

const roadmapItemSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Todo", "In progress", "Completed"],
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    commentCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes for efficient querying
roadmapItemSchema.index({ status: 1 });
roadmapItemSchema.index({ category: 1 });
roadmapItemSchema.index({ upvotes: 1 });

const roadmapItemModel = mongoose.model("RoadmapItem", roadmapItemSchema);
export default roadmapItemModel;
