import commentModel from "../models/commentModel.js";
import roadmapItemModel from "../models/roadmapItemModel.js";

export const createRoadmapItem = async (req, res) => {
  try {
    console.log("hello");
    const { title, description, status, category } = req.body;

    // Basic validation
    if (!title || !description || !status || !category) {
      return res.status(400).json({
        status: "fail",
        message:
          "All fields (title, description, status, category) are required.",
      });
    }

    // Create new roadmap item
    const newItem = await roadmapItemModel.create({
      title,
      description,
      status,
      category,
      upvotes: [],
      commentCount: 0,
    });

    return res.status(201).json({
      status: "success",
      message: "Roadmap item created successfully.",
      data: newItem,
    });
  } catch (error) {
    console.error("Error creating roadmap item:", error.message);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getRoadmapItem = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    /**
     * Fetch roadmap items from the database:
     * - Sorted by newest first
     * - Paginated using skip & limit
     */
    const roadmapItems = await roadmapItemModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await roadmapItemModel.countDocuments();

    return res.status(200).json({
      status: "success",
      total,
      data: roadmapItems,
      hasMore: skip + roadmapItems.length < total,
    });
  } catch (error) {
    console.log("Error in getRoadmapItem Controller: " + error.message);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

// export const getRoadmapItemDetails = async (req, res) => {
//   try {
//     const roadmapItemId = req.params.id;
//     const userId = req.user?._id;

//     // Fetch roadmap item
//     const roadmapItem = await roadmapItemModel.findById(roadmapItemId).lean();
//     if (!roadmapItem) {
//       return res.status(404).json({
//         status: "fail",
//         message: "Roadmap item not found.",
//       });
//     }

//     // Include upvote info
//     const upvotesCount = roadmapItem.upvotes.length;
//     const hasUpvoted = userId
//       ? roadmapItem.upvotes.some((id) => id.toString() === userId.toString())
//       : false;

//     // Fetch all comments for the item
//     const comments = await commentModel
//       .find({ roadmapItem: roadmapItemId })
//       .sort({ createdAt: -1 })
//       .populate("author", "_id fullName profileImageUrl")
//       .lean();

//     // Build nested comment structure
//     const commentMap = {};
//     const rootComments = [];

//     comments.forEach((comment) => {
//       comment.replies = [];
//       commentMap[comment._id] = comment;
//     });

//     // Helper: find nearest ancestor with depth < 2
//     const findValidParent = (comment) => {
//       let currentParentId = comment.parentComment?.toString();
//       while (currentParentId && commentMap[currentParentId]) {
//         const parent = commentMap[currentParentId];
//         if (parent.depth < 2) return parent;
//         currentParentId = parent.parentComment?.toString();
//       }
//       return null;
//     };

//     comments.forEach((comment) => {
//       const parentId = comment.parentComment?.toString();

//       if (parentId && commentMap[parentId]) {
//         const parent = commentMap[parentId];

//         // ✅ If parent is depth < 2, attach normally
//         if (parent.depth < 2) {
//           parent.replies.push(comment);
//         } else {
//           // ✅ If parent is already at depth 2+, find valid ancestor
//           const validParent = findValidParent(comment);
//           if (validParent) {
//             comment.depth = 2; // override depth for frontend
//             validParent.replies.push(comment);
//           } else {
//             rootComments.push(comment); // fallback if something went wrong
//           }
//         }
//       } else {
//         rootComments.push(comment);
//       }
//     });

//     res.status(200).json({
//       success: true,
//       data: {
//         roadmapItem: {
//           ...roadmapItem,
//           upvotesCount,
//           hasUpvoted,
//         },
//         comments: rootComments,
//       },
//     });
//   } catch (error) {
//     console.error("Roadmap Details Error:", error.message);
//     res.status(500).json({
//       status: "fail",
//       message: "Internal Server Error",
//     });
//   }
// };
export const getRoadmapItemDetails = async (req, res) => {
  try {
    const roadmapItemId = req.params.id;
    const userId = req.user?._id;

    // Fetch roadmap item
    const roadmapItem = await roadmapItemModel.findById(roadmapItemId).lean();
    if (!roadmapItem) {
      return res.status(404).json({
        status: "fail",
        message: "Roadmap item not found.",
      });
    }

    const upvotesCount = roadmapItem.upvotes.length;
    const hasUpvoted = userId
      ? roadmapItem.upvotes.some((id) => id.toString() === userId.toString())
      : false;

    // Fetch all comments, including their authors and parent comment's author
    const comments = await commentModel
      .find({ roadmapItem: roadmapItemId })
      .sort({ createdAt: 1 })
      .populate("author", "_id fullName profileImageUrl")
      .populate({
        path: "parentComment",
        populate: {
          path: "author",
          select: "_id fullName profileImageUrl",
        },
      })
      .lean();

    // Add a lightweight `parent` field for each comment (based on parentComment.author)
    comments.forEach((comment) => {
      if (comment.parentComment?.author) {
        comment.parent = {
          _id: comment.parentComment.author._id,
          fullName: comment.parentComment.author.fullName,
          profileImageUrl: comment.parentComment.author.profileImageUrl,
        };
      } else {
        comment.parent = null;
      }
    });

    // Build nested structure
    const commentMap = {};
    const rootComments = [];

    comments.forEach((comment) => {
      comment.replies = [];
      commentMap[comment._id] = comment;
    });

    const findValidParent = (comment) => {
      let currentParentId =
        comment.parentComment?._id?.toString() ||
        comment.parentComment?.toString();
      while (currentParentId && commentMap[currentParentId]) {
        const parent = commentMap[currentParentId];
        if (parent.depth < 2) return parent;
        currentParentId =
          parent.parentComment?._id?.toString() ||
          parent.parentComment?.toString();
      }
      return null;
    };

    comments.forEach((comment) => {
      const parentId =
        comment.parentComment?._id?.toString() ||
        comment.parentComment?.toString();

      if (parentId && commentMap[parentId]) {
        const parent = commentMap[parentId];

        if (parent.depth < 2) {
          parent.replies.push(comment);
        } else {
          const validParent = findValidParent(comment);
          if (validParent) {
            comment.depth = 2;
            validParent.replies.push(comment);
          } else {
            rootComments.push(comment);
          }
        }
      } else {
        rootComments.push(comment);
      }
    });

    res.status(200).json({
      success: true,
      data: {
        roadmapItem: {
          ...roadmapItem,
          upvotesCount,
          hasUpvoted,
        },
        comments: rootComments,
      },
    });
  } catch (error) {
    console.error("Roadmap Details Error:", error.message);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

export const getUniqueFilters = async (req, res) => {
  try {
    const statuses = await roadmapItemModel.distinct("status");
    const categories = await roadmapItemModel.distinct("category");

    res.status(200).json({
      status: "success",
      message: "Successfully retrived statuses & categories",
      data: {
        statuses,
        categories,
      },
    });
  } catch (error) {
    console.error("Error in getUniqueFilters controller", error.message);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const filteredRoadmapItems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 14;
    const skip = (page - 1) * limit;

    const { status, category, sortBy, search } = req.query;

    console.log("search", search);
    // Base match filter
    const filters = {};
    if (status) filters.status = new RegExp(`^${status}$`, "i"); 
    if (category) filters.category = new RegExp(`^${category}$`, "i");

    // Search logic (title or description, partial match, case-insensitive)
    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Sort condition (default: latest created first)
    let sortCondition = { createdAt: -1 };
    if (sortBy === "popularity") {
      sortCondition = { upvotesCount: -1 };
    } else if (sortBy === "oldest") {
      sortCondition = { createdAt: 1 };
    }

    console.log(filters);
    // Aggregation pipeline
    const pipeline = [
      { $match: filters },
      {
        $addFields: {
          upvotesCount: { $size: "$upvotes" },
        },
      },
      { $sort: sortCondition },
      { $skip: skip },
      { $limit: limit },
    ];

    const roadmapItems = await roadmapItemModel.aggregate(pipeline);

    // Get total count for pagination
    const countPipeline = [{ $match: filters }, { $count: "total" }];
    const countResult = await roadmapItemModel.aggregate(countPipeline);
    const totalCount = countResult[0]?.total || 0;

    // Response
    res.status(200).json({
      status: "success",
      message: "Successfully retrived",
      total: totalCount,
      data: roadmapItems,
      hasMore: skip + roadmapItems.length < totalCount,
    });
  } catch (error) {
    console.error("Error in filteredRoadmapItems:", error.message);
    res.status(500).json({
      status: "fail",
      message: "Internal server Error",
      error: error.message,
    });
  }
};

export const toggleUpvote = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    // Validate item existence
    const item = await roadmapItemModel.findById(id);
    if (!item) {
      return res.status(404).json({
        status: "fail",
        message: "Roadmap item not found",
      });
    }

    // Check if already upvoted
    const alreadyUpvoted = item.upvotes.includes(userId);

    let updatedItem;
    if (alreadyUpvoted) {
      // Remove the upvote
      updatedItem = await roadmapItemModel.findByIdAndUpdate(
        id,
        { $pull: { upvotes: userId } },
        { new: true }
      );
    } else {
      // Add the upvote
      updatedItem = await roadmapItemModel.findByIdAndUpdate(
        id,
        { $addToSet: { upvotes: userId } },
        { new: true }
      );
    }

    return res.status(200).json({
      status: "success",
      message: alreadyUpvoted ? "Upvote removed" : "Upvoted successfully",
      upvotesCount: updatedItem.upvotes.length,
      upvoted: !alreadyUpvoted,
    });
  } catch (error) {
    console.error("Error in toggleUpvote controller:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Server error",
      error: error.message,
    });
  }
};
