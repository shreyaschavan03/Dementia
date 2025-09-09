import express from "express";
import GameResult from "../models/GameResult.js";
import Session from "../models/Session.js";
import Frame from "../models/Frame.js";
const router = express.Router();

router.post("/result", async (req, res) => {
  try {
    const { sessionId, gameType, result } = req.body;
    if (!sessionId || !result) return res.status(400).json({ ok:false, error: "Missing fields" });

    const g = new GameResult({ sessionId, gameType, result });
    await g.save();
    res.json({ ok:true, result: g });
  } catch (err) {
    res.status(500).json({ ok:false, error: err.message });
  }
});

// Simple report combining latest game + some basic face heuristics.
// This is placeholder — replace with ML model later.
router.get("/report/:sessionId", async (req, res) => {
  try {
    const sid = req.params.sessionId;
    const games = await GameResult.find({ sessionId: sid }).sort({timestamp:-1}).limit(10).lean();
    const frames = await Frame.find({ sessionId: sid }).sort({timestamp:-1}).limit(50).lean();

    // naive scoring: slower reaction => higher risk
    let avgReaction = null;
    const reactionList = games.filter(g=>g.gameType==="reaction" && g.result?.reactionMs).map(g=>g.result.reactionMs);
    if (reactionList.length) {
      avgReaction = reactionList.reduce((a,b)=>a+b,0)/reactionList.length;
    }

    // face heuristic: variance of landmark z or missing landmarks -> rudimentary
    let faceScore = 0;
    if (frames.length) {
      const nonEmpty = frames.filter(f=>f.landmarks && f.landmarks.length>0);
      faceScore = nonEmpty.length ? 1 - (nonEmpty.length / frames.length) : 0; // higher if more empty
    }

    // combine
    let risk = 0;
    if (avgReaction) {
      // map reaction 200-1000ms -> 0-0.7
      const clamped = Math.max(200, Math.min(1200, avgReaction));
      risk += ((clamped - 200) / 1000) * 0.7;
    }
    risk += faceScore * 0.3;
    risk = Math.min(1, risk);

    res.json({ ok:true, avgReaction, faceScore, risk, games, framesCount: frames.length });
  } catch (err) {
    res.status(500).json({ ok:false, error: err.message });
  }
});

export default router;
