import React, { useEffect, useState } from "react";
import NavbarMain from "../components/NavbarAdmin";

const ReviewApplications = () => {
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/admin/applications", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
      setMessage("⚠️ Error loading applications.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    try {
      await fetch(`http://localhost:8080/api/admin/application/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchApplications(); // refresh
      setMessage("🗑️ Application deleted successfully.");
    } catch (err) {
      console.error("Delete error:", err);
      setMessage("❌ Failed to delete application.");
    }
  };

  const styles = {
    container: {
      maxWidth: "1100px",
      margin: "40px auto",
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      fontFamily: "Segoe UI, sans-serif",
    },
    title: {
      color: "#0d6efd",
      fontWeight: "bold",
      marginBottom: "20px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    th: {
      backgroundColor: "#0d6efd",
      color: "#fff",
      padding: "10px",
      textAlign: "center",
    },
    td: {
      padding: "10px",
      textAlign: "center",
      borderBottom: "1px solid #ddd",
    },
    button: {
      margin: "0 5px",
      padding: "6px 10px",
      borderRadius: "4px",
      border: "none",
      fontWeight: "bold",
      cursor: "pointer",
    },
    viewBtn: {
      backgroundColor: "#0d6efd",
      color: "#fff",
    },
    deleteBtn: {
      backgroundColor: "#dc3545",
      color: "#fff",
    },
    message: {
      marginBottom: "15px",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      color: "#0d6efd",
      borderRadius: "6px",
      textAlign: "center",
    },
  };

  return (
    <>
      <NavbarMain />
      <div style={styles.container}>
        <h3 style={styles.title}>All Applications Submitted</h3>
        {message && <div style={styles.message}>{message}</div>}
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Application ID</th>
              <th style={styles.th}>Job Title</th>
              <th style={styles.th}>Applicant Email</th>
              <th style={styles.th}>Date Applied</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan="6" style={styles.td}>No applications found.</td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app.applicationId}>
                  <td style={styles.td}>{app.applicationId}</td>
                  <td style={styles.td}>{app.job?.title}</td>
                  <td style={styles.td}>{app.seekerEmail}</td>
                  <td style={styles.td}>{app.appliedDate}</td>
                  <td style={styles.td}>{app.status}</td>
                  <td style={styles.td}>
                    {app.resumePath ? (
                      <a
                        href={`http://localhost:8080/${app.resumePath}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ ...styles.button, ...styles.viewBtn }}
                      >
                        View
                      </a>
                    ) : (
                      "No Resume"
                    )}
                    <button
                      onClick={() => handleDelete(app.applicationId)}
                      style={{ ...styles.button, ...styles.deleteBtn }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ReviewApplications;
