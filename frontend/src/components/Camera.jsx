import React, { useRef, useState } from "react";

export default function Camera() {
  const videoRef = useRef();
  const [streaming, setStreaming] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setStreaming(true);
    } catch (err) {
      alert("Camera access failed");
    }
  };

  const stopCamera = () => {
    if (videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setStreaming(false);
  };

  return (
    <div>
      <video ref={videoRef} autoPlay width="400" height="300" />
      <div>
        {!streaming && <button onClick={startCamera}>Start Camera</button>}
        {streaming && <button onClick={stopCamera}>Stop Camera</button>}
      </div>
    </div>
  );
}
