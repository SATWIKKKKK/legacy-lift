import mongoose from "mongoose"

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: String,
  githubUrl: String,
  uploadedFiles: [
    {
      filename: String,
      originalName: String,
      size: Number,
      uploadedAt: Date,
    },
  ],
  versions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Version",
    },
  ],
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "failed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("Project", projectSchema)
