import React, { useEffect, useState } from "react";
import api from "../api";
import NavbarUser from "../components/NavbarUser";

const BrowseJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [keyword, setKeyword] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs"); 
        setJobs(res.data);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        alert("An error occurred while fetching jobs.");
      }
    };

    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    if (!user || user.role !== "JOB_SEEKER") {
      alert("Only job seekers can apply for jobs.");
      return;
    }

    try {
      await api.post("/applications", {
        seekerEmail: user.email,
        job: { id: jobId },
      });
      alert("Application submitted successfully!");
    } catch (err) {
      console.error("Error applying for job:", err);
      alert("Failed to apply for job.");
    }
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(keyword.toLowerCase())
  );

  const styles = {
    container: {
      maxWidth: "900px",
      margin: "40px auto",
      padding: "20px",
      fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
    },
    heading: {
      textAlign: "center",
      fontSize: "2.5rem",
      fontWeight: "bold",
      color: "#fff",
      marginBottom: "30px",
      padding: "15px",
      borderRadius: "10px",
      backgroundColor: "#0d6efd",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      letterSpacing: "1px",
      textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
    },
    searchBox: {
      width: "100%",
      padding: "10px",
      fontSize: "16px",
      marginBottom: "30px",
      borderRadius: "8px",
      border: "1px solid #ccc",
    },
    jobCard: {
      backgroundColor: "#f9f9f9",
      border: "1px solid #ddd",
      borderRadius: "10px",
      padding: "20px",
      marginBottom: "20px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    },
    title: {
      marginBottom: "10px",
      color: "#333",
    },
    description: {
      color: "#555",
    },
    details: {
      fontSize: "14px",
      color: "#777",
    },
    applyBtn: {
      marginTop: "15px",
      padding: "8px 20px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
    },
    noMatch: {
      textAlign: "center",
      fontSize: "18px",
      color: "#888",
    },
  };

  return (
    <>
      <NavbarUser />
      <div style={styles.container}>
        <h3 style={styles.heading}>Browse and Search Jobs</h3>

        <input
          type="text"
          placeholder="Search jobs by title"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={styles.searchBox}
        />

        {filteredJobs.length === 0 ? (
          <p style={styles.noMatch}>No matching jobs found.</p>
        ) : (
          filteredJobs.map((job) => (
            <div key={job.id} style={styles.jobCard}>
              <h5 style={styles.title}>{job.title}</h5>
              <p style={styles.description}>{job.description}</p>
              <p style={styles.details}>
                {job.location} | ₹{job.salary}
              </p>
              <button
                style={styles.applyBtn}
                onClick={() => handleApply(job.id)}
              >
                Apply
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default BrowseJobs;
