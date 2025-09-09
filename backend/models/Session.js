import mongoose from "mongoose";
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  subjectId: { type: String, default: null },
  notes: { type: String, default: "" },
});

export default mongoose.model("Session", SessionSchema);
