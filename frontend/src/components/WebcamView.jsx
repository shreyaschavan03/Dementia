import React, { useRef } from "react";

function WebcamView() {
  const videoRef = useRef(null);

  const capturePhoto = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const dataURL = canvas.toDataURL("image/jpeg"); // base64 image
    const blob = await (await fetch(dataURL)).blob();

    // send to backend
    const formData = new FormData();
    formData.append("file", blob, "photo.jpg"); // must match multer field name "file"

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      alert("Photo saved successfully!");
      console.log(data.filePath); // path of saved file
    } catch (err) {
      console.error(err);
      alert("Failed to save photo.");
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline></video>
      <button onClick={capturePhoto}>Capture Photo</button>
    </div>
  );
}

export default WebcamView;
