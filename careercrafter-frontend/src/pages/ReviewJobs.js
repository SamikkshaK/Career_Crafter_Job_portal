import React, { useEffect, useState } from "react";
import NavbarMain from "../components/NavbarAdmin";

const ReviewJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/jobs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 403 || res.status === 401) {
        setMessage("❌ Unauthorized access. Please log in as admin.");
        return;
      }

      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setMessage("⚠️ Error loading jobs");
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/jobs/${jobId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setMessage("❌ Failed to delete job.");
        return;
      }

      setMessage("🗑️ Job deleted successfully");
      fetchJobs();
    } catch (err) {
      console.error("Error deleting job:", err);
      setMessage("❌ Failed to delete job.");
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
    btnDelete: {
      backgroundColor: "#dc3545",
      color: "#fff",
      border: "none",
      padding: "6px 12px",
      borderRadius: "4px",
      cursor: "pointer",
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
        <h3 style={styles.title}>All Posted Jobs</h3>
        {message && <div style={styles.message}>{message}</div>}
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Location</th>
              <th style={styles.th}>Salary</th>
              <th style={styles.th}>Employer Email</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan="6" style={styles.td}>No jobs available.</td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job.id}>
                  <td style={styles.td}>{job.id}</td>
                  <td style={styles.td}>{job.title}</td>
                  <td style={styles.td}>{job.location}</td>
                  <td style={styles.td}>{job.salary}</td>
                  <td style={styles.td}>{job.employerEmail}</td>
                  <td style={styles.td}>
                    <button
                      style={styles.btnDelete}
                      onClick={() => handleDelete(job.id)}
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

export default ReviewJobs;
