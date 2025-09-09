import mongoose from "mongoose";
const Schema = mongoose.Schema;

const GameResultSchema = new Schema({
  sessionId: { type: Schema.Types.ObjectId, ref: "Session", required: true },
  gameType: { type: String, default: "reaction" },
  result: { type: Schema.Types.Mixed }, // {reactionMs:123,...}
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("GameResult", GameResultSchema);
