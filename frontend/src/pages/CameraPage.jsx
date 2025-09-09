import React, { useRef, useState } from "react";
import "./CameraPage.css";

export default function CameraPage() {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
    } catch (err) {
      alert("Camera access failed: " + err.message);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("file", blob, "capture.jpg");
      try {
        const res = await fetch("http://localhost:5000/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (res.ok) alert("Photo captured successfully!");
        else alert("Upload failed: " + data.error);
      } catch (err) {
        alert("Upload failed: " + err.message);
      }
    }, "image/jpeg");
  };

  return (
    <div className="camera-container">
      <h2>Camera</h2>
      <video ref={videoRef} autoPlay playsInline className="camera-video"></video>
      <div className="camera-buttons">
        <button onClick={startCamera}>Start Camera</button>
        <button onClick={stopCamera}>Stop Camera</button>
        <button onClick={capturePhoto}>Capture Photo</button>
      </div>
    </div>
  );
}
