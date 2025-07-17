import React, { useState, useEffect } from "react";
import NavbarEmployer from "../components/NavbarEmployer";

const ManageJobs = () => {
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const API_BASE = "http://localhost:8080/api/jobs";

  const [jobs, setJobs] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editJob, setEditJob] = useState({});
  const [message, setMessage] = useState("");

  // 🔐 Fetch jobs with JWT
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${API_BASE}/employer/${email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setJobs(data);
        } else {
          throw new Error("Unauthorized or fetch failed");
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setMessage("⚠️ Unauthorized or failed to load jobs");
      }
    };

    if (email && token) fetchJobs();
  }, [email, token]);

  const handleEditClick = (job) => {
    setEditId(job.id);
    setEditJob({ ...job });
    setMessage("");
  };

  const handleCancel = () => {
    setEditId(null);
    setEditJob({});
    setMessage("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditJob((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${API_BASE}/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editJob),
      });

      if (res.ok) {
        const updatedRes = await fetch(`${API_BASE}/employer/${email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await updatedRes.json();
        setJobs(data);
        setMessage("✅ Job updated successfully!");
        setEditId(null);
      } else {
        setMessage("❌ Failed to update job.");
      }
    } catch (err) {
      console.error("Update error:", err);
      setMessage("⚠️ Server error.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this job?")) {
      try {
        const res = await fetch(`${API_BASE}/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          setJobs(jobs.filter((j) => j.id !== id));
          setMessage("🗑️ Job deleted.");
        } else {
          setMessage("❌ Failed to delete.");
        }
      } catch (err) {
        console.error("Delete error:", err);
        setMessage("⚠️ Server error.");
      }
    }
  };

  const styles = {
    container: {
      maxWidth: "1000px",
      margin: "30px auto",
      padding: "20px",
      backgroundColor: "#fefefe",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      borderRadius: "12px",
      fontFamily: "'Segoe UI', sans-serif",
    },
    heading: {
      textAlign: "center",
      color: "#0d6efd",
      fontWeight: "bold",
      marginBottom: "20px",
    },
    alert: {
      textAlign: "center",
      marginBottom: "20px",
      padding: "10px",
      borderRadius: "6px",
      backgroundColor: "#e9f5ff",
      color: "#0d6efd",
      fontWeight: "bold",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    th: {
      backgroundColor: "#343a40",
      color: "#fff",
      padding: "10px",
      textAlign: "center",
    },
    td: {
      padding: "10px",
      textAlign: "center",
      borderBottom: "1px solid #ddd",
    },
    input: {
      width: "100%",
      padding: "6px",
      borderRadius: "4px",
      border: "1px solid #ccc",
    },
    button: {
      padding: "6px 12px",
      margin: "2px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "14px",
    },
    editBtn: {
      backgroundColor: "#0dcaf0",
      color: "#fff",
    },
    deleteBtn: {
      backgroundColor: "#dc3545",
      color: "#fff",
    },
    saveBtn: {
      backgroundColor: "#198754",
      color: "#fff",
    },
    cancelBtn: {
      backgroundColor: "#6c757d",
      color: "#fff",
    },
    noJobs: {
      textAlign: "center",
      color: "#555",
      padding: "20px 0",
    },
  };

  return (
    <>
      <NavbarEmployer />
      <div style={styles.container}>
        <h3 style={styles.heading}>Manage Your Posted Jobs</h3>
        {message && <div style={styles.alert}>{message}</div>}
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Location</th>
              <th style={styles.th}>Salary</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) =>
              editId === job.id ? (
                <tr key={job.id}>
                  <td style={styles.td}>
                    <input
                      name="title"
                      value={editJob.title}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  </td>
                  <td style={styles.td}>
                    <input
                      name="location"
                      value={editJob.location}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  </td>
                  <td style={styles.td}>
                    <input
                      name="salary"
                      type="number"
                      value={editJob.salary}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  </td>
                  <td style={styles.td}>
                    <textarea
                      name="description"
                      value={editJob.description}
                      onChange={handleChange}
                      rows={2}
                      style={{ ...styles.input, resize: "vertical" }}
                    />
                  </td>
                  <td style={styles.td}>
                    <button onClick={handleUpdate} style={{ ...styles.button, ...styles.saveBtn }}>
                      Save
                    </button>
                    <button onClick={handleCancel} style={{ ...styles.button, ...styles.cancelBtn }}>
                      Cancel
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={job.id}>
                  <td style={styles.td}>{job.title}</td>
                  <td style={styles.td}>{job.location}</td>
                  <td style={styles.td}>{job.salary}</td>
                  <td style={styles.td}>{job.description}</td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleEditClick(job)}
                      style={{ ...styles.button, ...styles.editBtn }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
                      style={{ ...styles.button, ...styles.deleteBtn }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
            {jobs.length === 0 && (
              <tr>
                <td colSpan="5" style={styles.noJobs}>
                  No jobs posted yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ManageJobs;
