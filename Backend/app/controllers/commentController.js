import commentModel from "../models/commentModel.js";
import roadmapItemModel from "../models/roadmapItemModel.js";

export const createComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { roadmapItemId, parentCommentId, content } = req.body;

    // Validate content
    if (!content || content.trim().length === 0) {
      return res
        .status(400)
        .json({ 
          status: "fail",  
          message: "Comment content is required." 
        });
    }

    // Check if roadmap item exists
    const roadmapItem = await roadmapItemModel.findById(roadmapItemId);
    if (!roadmapItem) {
      return res
        .status(404)
        .json({ 
          status: "fail", 
          message: "Roadmap item not found."
        });
    }

    // Default to top-level comment
    let depth = 0;

    // If it's a reply
    if (parentCommentId) {
      const parent = await commentModel.findById(parentCommentId);

      if (!parent) {
        return res
          .status(404)
          .json({ 
            status: "fail", 
            message: "Parent comment not found." 
          });
      }

      //nesting to a max depth of 2
      depth = parent.depth >= 2 ? 2 : parent.depth + 1;
    }

    // Create the comment
    const newComment = await commentModel.create({
      content,
      author: userId,
      roadmapItem: roadmapItemId,
      parentComment: parentCommentId || null,
      depth,
    });

    // Increment comment count in roadmap item
    await roadmapItemModel.findByIdAndUpdate(roadmapItemId, {
      $inc: { commentCount: 1 },
    });

    return res.status(201).json({
      status: "success",
      message: "Comment created successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error("Error in createComment Controller:", error.message);
    return res
      .status(500)
      .json({ 
        status: "fail", 
        message: "Internal Server Error",
        error:error.message
      });
  }
};

export const updateComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const commentId = req.params.commentId;
    const { content } = req.body;

    // Validate content
    if (!content || content.trim().length === 0) {
      return res
        .status(400)
        .json({ status: "fail", message: "Updated content is required" });
    }

    // Fetch the comment
    const comment = await commentModel.findById(commentId);
    if (!comment) {
      return res
        .status(404)
        .json({ status: "fail", message: "Comment not found" });
    }

    // Only author can update
    if (comment.author.toString() !== userId.toString()) {
      return res.status(403).json({
        status: "fail",
        message: "Unauthorized to update this comment",
      });
    }

    // Update content and mark as edited
    comment.content = content;
    comment.isEdited = true;
    await comment.save();

    return res.status(200).json({
      status: "success",
      message: "Comment updated successfully",
      comment,
    });
  } catch (error) {
    console.error("Error in updateComment controller:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
      error:error.message
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const commentId = req.params.commentId;

    const comment = await commentModel.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        status: "fail",
        message: "Comment not found.",
      });
    }

    if (comment.author.toString() !== userId.toString()) {
      return res.status(403).json({
        status: "fail",
        message: "Unauthorized to delete this comment.",
      });
    }

    const roadmapItemId = comment.roadmapItem;

    // 🔁 Recursive counter for nested comments
    const countNestedComments = async (parentId) => {
      let count = 0;
      const children = await commentModel.find({ parentComment: parentId });
      for (const child of children) {
        count += 1 + (await countNestedComments(child._id));
      }
      return count;
    };

    // 🔁 Recursive deleter
    const deleteCommentAndChildren = async (id) => {
      const children = await commentModel.find({ parentComment: id });
      for (const child of children) {
        await deleteCommentAndChildren(child._id);
      }
      await commentModel.findByIdAndDelete(id);
    };

    const totalRemoved = 1 + (await countNestedComments(commentId));
    await deleteCommentAndChildren(commentId);

    await roadmapItemModel.findByIdAndUpdate(roadmapItemId, {
      $inc: { commentCount: -totalRemoved },
    });

    return res.status(200).json({
      status:"success",
      message: "Comment and its replies deleted successfully.",
      data:{
        totalRemoved
      }
    });
  } catch (error) {
    console.error("Error in DeleteComment Controller:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
      error:error.message
    });
  }
};

