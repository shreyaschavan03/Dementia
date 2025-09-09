const handleCapture = async () => {
  if (!imageSrc) return alert("No photo captured");

  try {
    const blob = await (await fetch(imageSrc)).blob();
    const formData = new FormData();
    formData.append("file", blob, "capture.png"); // <-- "file" must match backend

    const res = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      alert("Upload successful!");
      console.log("Uploaded file path:", data.filePath);
    } else {
      alert("Upload failed: " + data.error);
    }
  } catch (err) {
    console.error(err);
    alert("Upload failed!");
  }
};
