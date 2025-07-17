import React, { useState, useEffect, useCallback } from "react";
import NavbarUser from "../components/NavbarUser";

const UploadResume = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [resumes, setResumes] = useState([]);

  const fetchUploadedResumes = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8080/api/resumes", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      const myResumes = data.filter((r) => r.jobSeeker?.id === user.id);
      setResumes(myResumes);
    } catch (err) {
      console.error("Error fetching resumes:", err);
    }
  }, [user.id, token]);

  useEffect(() => {
    fetchUploadedResumes();
  }, [fetchUploadedResumes]);

  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", description);
    formData.append("seekerId", user.id);

    try {
      const res = await fetch("http://localhost:8080/api/resumes/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });

      const result = await res.text();
      if (res.ok) {
        setMessage("✅ Resume uploaded successfully!");
        setFile(null);
        setDescription("");
        fetchUploadedResumes();
      } else {
        setMessage("❌ Upload failed: " + result);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("❌ Upload failed. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;

    try {
      await fetch(`http://localhost:8080/api/resumes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessage("🗑️ Resume deleted.");
      fetchUploadedResumes();
    } catch (error) {
      console.error("Delete error:", error);
      setMessage("❌ Failed to delete resume.");
    }
  };

  const styles = {
    container: {
      maxWidth: "600px",
      margin: "50px auto",
      padding: "30px",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 0 15px rgba(0, 0, 0, 0.15)",
      fontFamily: "'Segoe UI', sans-serif",
    },
    heading: {
      textAlign: "center",
      color: "#0d6efd",
      marginBottom: "25px",
      fontWeight: "700",
    },
    label: {
      fontWeight: "600",
      marginBottom: "8px",
      display: "block",
    },
    input: {
      width: "100%",
      padding: "10px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      marginBottom: "20px",
    },
    button: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#28a745",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      fontWeight: "bold",
      fontSize: "16px",
      cursor: "pointer",
    },
    messageBox: {
      marginTop: "20px",
      textAlign: "center",
      padding: "10px",
      borderRadius: "6px",
      backgroundColor: "#e7f3ff",
      color: "#0056b3",
      fontWeight: "500",
    },
    listHeading: {
      marginTop: "40px",
      fontWeight: "600",
      fontSize: "18px",
      color: "#333",
    },
    resumeItem: {
      backgroundColor: "#f8f9fa",
      border: "1px solid #ddd",
      borderRadius: "6px",
      padding: "10px",
      marginTop: "10px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "10px",
    },
    viewBtn: {
      backgroundColor: "#0d6efd",
      color: "white",
      border: "none",
      borderRadius: "4px",
      padding: "5px 12px",
      textDecoration: "none",
      fontWeight: "bold",
      fontSize: "14px",
    },
    deleteBtn: {
      backgroundColor: "#dc3545",
      color: "white",
      border: "none",
      borderRadius: "4px",
      padding: "5px 10px",
      fontSize: "14px",
      cursor: "pointer",
    },
  };

  return (
    <>
      <NavbarUser />
      <div style={styles.container}>
        <h2 style={styles.heading}>Upload Your Resume</h2>

        <form onSubmit={handleUpload}>
          <label style={styles.label}>Select Resume (PDF, DOC, etc.)</label>
          <input
            type="file"
            style={styles.input}
            onChange={(e) => setFile(e.target.files[0])}
            required
          />

          <label style={styles.label}>Description</label>
          <input
            type="text"
            placeholder="e.g. My updated resume"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>Upload</button>
        </form>

        {message && <div style={styles.messageBox}>{message}</div>}

        {resumes.length > 0 && (
          <>
            <h5 style={styles.listHeading}>Previously Uploaded Resumes</h5>
            {resumes.map((r) => (
              <div key={r.id} style={styles.resumeItem}>
                <span>{r.description || r.fileUrl}</span>
                <div>
                  <a
                    href={`http://localhost:8080/${r.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.viewBtn}
                  >
                    View
                  </a>
                  <button
                    onClick={() => handleDelete(r.id)}
                    style={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default UploadResume;
