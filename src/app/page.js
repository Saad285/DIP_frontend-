"use client";

import { useState, useRef } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [apiUrl, setApiUrl] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [task, setTask] = useState("end2end");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
    }
  };

  const handleProcess = async () => {
    if (!apiUrl) {
      setError("Please paste your Google Colab ngrok URL first.");
      return;
    }
    if (!file) {
      setError("Please upload an image.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("task", task);

    // Make sure URL doesn't have trailing slash
    const cleanUrl = apiUrl.replace(/\/$/, "");

    try {
      const response = await fetch(`${cleanUrl}/process`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong while connecting to Colab.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>DocRes AI Hub</h1>
        <p className={styles.subtitle}>Unified Document Image Restoration & Auto Translation</p>
      </header>

      {/* Connection Panel */}
      <section className={styles.glassPanel}>
        <div className={styles.connectionPanel}>
          <input
            type="url"
            placeholder="Paste your Colab ngrok URL here (e.g., https://abcd.ngrok-free.app)"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            className={styles.inputField}
          />
        </div>
        <p style={{ fontSize: "0.95rem", color: "#888", marginTop: "-1rem" }}>
          *Run the Colab backend script first, and paste the generated ngrok link above to connect to your GPU.
        </p>
      </section>

      <div className={styles.mainGrid}>
        {/* Upload & Controls Panel */}
        <section className={styles.glassPanel}>
          <div 
            className={styles.uploadArea}
            onClick={() => fileInputRef.current?.click()}
          >
            {preview ? (
              <img src={preview} alt="Preview" className={styles.previewImage} />
            ) : (
              <>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <div className={styles.uploadText}>Click or drag to upload document image</div>
              </>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            style={{ display: "none" }} 
          />

          <div className={styles.selectTask}>
            <label style={{ color: "#fff", fontWeight: "600", fontSize: "1.1rem" }}>Select AI Task:</label>
            <select value={task} onChange={(e) => setTask(e.target.value)}>
              <option value="end2end">End-to-End (Unwarp 3D Curved Pages)</option>
              <option value="dewarping">Dewarping Only</option>
              <option value="deshadowing">Deshadowing (Fix Lighting/Shadows)</option>
              <option value="appearance">Appearance Enhancement</option>
              <option value="binarization">Binarization (Pure Black & White)</option>
              <option value="deblurring">Deblurring</option>
            </select>
          </div>

          <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center" }}>
            <button 
              className={styles.button} 
              onClick={handleProcess}
              disabled={loading || !file}
              style={{ width: "100%" }}
            >
              {loading ? "Processing on Colab GPU..." : "Initialize AI Restoration"}
            </button>
          </div>

          {loading && <div className={styles.status}>Uploading to Colab, running AI models, extracting text, and translating... Please wait...</div>}
          {error && <div className={styles.error}>{error}</div>}
        </section>

        {/* Results Panel */}
        <section className={styles.glassPanel}>
          {!result ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#888", textAlign: "center", fontSize: "1.1rem" }}>
              <p>Your restored document and translated text will appear here automatically.</p>
            </div>
          ) : (
            <div className={styles.resultBox}>
              <h2 style={{ color: "var(--accent-color)", marginTop: 0, borderBottom: "1px solid var(--glass-border)", paddingBottom: "1rem" }}>Restoration Complete</h2>
              
              <img src={result.image_base64} alt="Restored Document" className={styles.resultImage} />
              
              <div className={styles.textResult}>
                <h3>Original English Text</h3>
                {result.original_text || "No text detected."}
              </div>

              <div className={styles.textResult} style={{ borderColor: "var(--accent-color)" }}>
                <h3>Urdu Translation (اردو ترجمہ)</h3>
                <div style={{ fontSize: "1.3rem", lineHeight: "2", textAlign: "right" }} dir="rtl">
                  {result.translated_text || "کوئی متن نہیں ملا۔"}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
