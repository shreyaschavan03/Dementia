import { useState, useEffect } from "react";

export default function ReactionGame({ sessionId = null }) {
  const [state, setState] = useState("idle"); // idle, waiting, ready, result
  const [message, setMessage] = useState("Click Start to play");
  const [reaction, setReaction] = useState(null);
  const [startTs, setStartTs] = useState(null);

  useEffect(() => {
    let timer;
    if (state === "waiting") {
      const delay = Math.floor(Math.random() * 2500) + 1000; // 1-3.5s
      timer = setTimeout(() => {
        setState("ready");
        setMessage("CLICK!");
        setStartTs(Date.now());
      }, delay);
    }
    return () => clearTimeout(timer);
  }, [state]);

  function start() {
    setState("waiting");
    setMessage("Wait for green...");
    setReaction(null);
  }

  async function reportResult(reactionMs) {
    if (!sessionId) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/games/result`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, gameType: "reaction", result: { reactionMs } })
      });
    } catch (err) {
      console.warn("reportResult failed", err);
    }
  }

  function handleClick() {
    if (state === "ready") {
      const r = Date.now() - startTs;
      setReaction(r);
      setMessage(`Reaction: ${r} ms`);
      setState("result");
      reportResult(r);
    } else if (state === "waiting") {
      setMessage("Too soon — click Start");
      setState("idle");
    } else {
      start();
    }
  }

  return (
    <div className="card-shadow p-6 rounded-lg bg-white">
      <h3 className="text-lg font-semibold mb-3">Reaction Game</h3>

      <div onClick={handleClick}
           className={`w-full h-40 flex items-center justify-center rounded-md cursor-pointer select-none ${
             state === "ready" ? "bg-green-500 text-white" : state === "waiting" ? "bg-red-400 text-white" : "bg-gray-100 text-gray-700"
           }`}
      >
        <div className="text-xl font-medium">{message}</div>
      </div>

      <div className="mt-4 flex gap-3">
        <button onClick={start} className="bg-purple-600 text-white px-4 py-2 rounded">Start</button>
        <button onClick={() => { setState("idle"); setMessage("Click Start to play"); }} className="bg-gray-200 px-4 py-2 rounded">Reset</button>
      </div>

      {reaction && <div className="mt-3 text-sm text-gray-700">Last result: {reaction} ms</div>}
    </div>
  );
}
