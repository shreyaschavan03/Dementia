import mongoose from "mongoose";
const Schema = mongoose.Schema;

const FrameSchema = new Schema({
  sessionId: { type: Schema.Types.ObjectId, ref: "Session", required: true },
  timestamp: { type: Date, default: Date.now },
  // either landmarks (recommended) OR imagePath
  landmarks: { type: Array, default: [] }, // [{x,y,z},...]
  imagePath: { type: String, default: null }, // if you must store images
});

export default mongoose.model("Frame", FrameSchema);
