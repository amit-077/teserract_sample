import React, { useState } from "react";
import axios from "axios";
import { createWorker } from "tesseract.js";

const App = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadedFile, setUploadedFile] = useState("");
  const [extractedText, setExtractedText] = useState("");

  const uploadFileToCloud = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("upload_preset", "instagram_clone");
    formData.append("cloud_name", "dnf13nlhy");

    let response = await axios.post(
      "https://api.cloudinary.com/v1_1/dnf13nlhy/image/upload",
      formData
    );

    return response.data.secure_url;
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setUploadedFile(file);
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview("");
  };

  const extractText = async (file) => {
    try {
      const worker = await createWorker();

      // Start the worker
      await worker.load();
      await worker.loadLanguage("eng");
      await worker.initialize("eng");

      // Log progress explicitly, not as part of options

      // Recognize text from the file
      const { data } = await worker.recognize(file);
      console.log("Extracted Text:", data.text);
      setExtractedText(data.text);

      // Terminate the worker
      await worker.terminate();
    } catch (error) {
      console.error("Error during text extraction:", error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Image Upload & Preview</h1>
        <div style={styles.uploadContainer}>
          <input
            type="file"
            accept="image/*"
            id="fileInput"
            style={styles.fileInput}
            onChange={async (e) => {
              handleImageChange(e);
              let data = await uploadFileToCloud(e);
              console.log(data);
              await extractText(e.target.files[0]);
            }}
          />
          <label htmlFor="fileInput" style={styles.uploadButton}>
            Choose an Image
          </label>
        </div>
        {imagePreview && (
          <div style={styles.previewSection}>
            <img src={imagePreview} alt="Preview" style={styles.imagePreview} />
            <button style={styles.removeButton} onClick={handleRemoveImage}>
              Remove Image
            </button>
          </div>
        )}
      </div>
      <div>
        <textarea
          rows={20}
          style={{ width: "50rem", backgroundColor: "#fcfcfc", color: "#333" }}
          placeholder="Extracted text will be shown here"
          value={extractedText}
        ></textarea>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    paddingTop: "2rem",
    paddingBottom: "3rem",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f0f4f8",
    margin: 0,
    width: "100vw",
    flexDirection: "column",
    gap: "2rem",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "30px 0",
    borderRadius: "15px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    width: "50rem",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333333",
    marginBottom: "20px",
  },
  uploadContainer: {
    marginBottom: "20px",
  },
  fileInput: {
    display: "none",
  },
  uploadButton: {
    display: "inline-block",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "5px",
    cursor: "pointer",
    textDecoration: "none",
    transition: "background-color 0.3s ease",
  },
  uploadButtonHover: {
    backgroundColor: "#0056b3",
  },
  previewSection: {
    marginTop: "20px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePreview: {
    width: "100%",
    maxWidth: "250px",
    height: "auto",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    marginBottom: "10px",
  },
  removeButton: {
    padding: "10px 15px",
    backgroundColor: "#ff4d4d",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "bold",
    borderRadius: "5px",
    cursor: "pointer",
    border: "none",
    transition: "background-color 0.3s ease",
  },
};

export default App;
