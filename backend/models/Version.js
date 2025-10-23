import mongoose from "mongoose"

const versionSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  versionNumber: {
    type: Number,
    required: true,
  },
  files: [
    {
      filename: String,
      originalCode: String,
      refactoredCode: String,
      changes: [
        {
          type: String,
          description: String,
        },
      ],
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
      },
    },
  ],
  summary: String,
  aiSuggestions: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("Version", versionSchema)
