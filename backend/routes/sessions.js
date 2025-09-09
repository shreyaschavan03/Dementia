import express from "express";
import Session from "../models/Session.js";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const s = new Session(req.body);
    await s.save();
    res.json({ ok:true, session: s });
  } catch (err) {
    res.status(500).json({ ok:false, error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const s = await Session.findById(req.params.id);
    res.json({ ok:true, session: s });
  } catch (err) {
    res.status(500).json({ ok:false, error: err.message });
  }
});

export default router;
