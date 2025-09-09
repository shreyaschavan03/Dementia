import WebcamView from "./WebcamView";
import { useNavigate } from "react-router-dom";

export default function Dashboard(){
  const navigate = useNavigate();

  async function createSessionAndStart() {
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL||"http://localhost:5000"}/api/sessions`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({})
      });
      const data = await resp.json();
      if (data?.session?._id) {
        // store session id in localStorage so GamePage/Webcam can use it
        localStorage.setItem("sessionId", data.session._id);
        navigate("/game");
      } else {
        alert("Failed to create session");
      }
    } catch (err) {
      alert("Network error");
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h2 className="text-xl font-bold mb-3">Camera</h2>
        <WebcamView onFrame={async (base64) => {
          // optionally send frames as landmarks later; for now send base64
          const sessionId = localStorage.getItem("sessionId");
          if (!sessionId) return;
          try {
            await fetch(`${import.meta.env.VITE_API_URL||"http://localhost:5000"}/api/frames`, {
              method: "POST",
              headers: {"Content-Type":"application/json"},
              body: JSON.stringify({ sessionId, imageBase64: base64 })
            });
          } catch (err) {
            // ignore network errors during background frames
          }
        }} />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-3">Games</h2>
        <div className="p-4 bg-white rounded-lg card-shadow">
          <p className="mb-3">Reaction game — click the button to start a new session & go to the game page.</p>
          <button onClick={createSessionAndStart} className="bg-indigo-600 text-white px-4 py-2 rounded">Start Session & Play Game</button>
        </div>
      </div>
    </div>
  );
}
