import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import NavbarEmployer from "../components/NavbarEmployer";

const PostJobs = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const role = localStorage.getItem("role");

  const [job, setJob] = useState({
    title: "",
    location: "",
    salary: "",
    description: "",
    employerEmail: user?.email || "",
    companyId: "",
  });

  const [companyName, setCompanyName] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Redirect if not an employer
  useEffect(() => {
    if (!user?.email || role !== "EMPLOYER") {
      alert("❌ Please login as an employer");
      navigate("/login");
    }
  }, [navigate, user, role]);

  // ✅ Fetch company info for employer
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await api.get(`/companies/by-email/${user.email}`);
        const data = res.data;
        setJob((prev) => ({ ...prev, companyId: data.companyId }));
        setCompanyName(data.companyName);
      } catch (err) {
        console.error(err);
        setMessage("❌ Failed to load company info");
      }
    };

    if (user.email) {
      fetchCompany();
    }
  }, [user.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await api.post("/jobs", job);
      if (res.status === 200 || res.status === 201) {
        setMessage("✅ Job posted successfully!");
        setJob({
          title: "",
          location: "",
          salary: "",
          description: "",
          employerEmail: user.email,
          companyId: job.companyId,
        });
      } else {
        setMessage("❌ Failed to post job");
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Server error occurred");
    }
  };

  const styles = {
    container: {
      backgroundImage: `url("/images/background.jpg")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "40px 15px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    card: {
      backgroundColor: "#fff",
      padding: "40px 30px",
      borderRadius: "15px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
      width: "100%",
      maxWidth: "700px",
    },
    heading: {
      textAlign: "center",
      marginBottom: "30px",
      color: "#0d6efd",
      fontWeight: 700,
    },
    label: {
      fontWeight: "600",
      marginBottom: "5px",
    },
    input: {
      marginBottom: "20px",
      padding: "10px",
      width: "100%",
      borderRadius: "6px",
      border: "1px solid #ccc",
    },
    textarea: {
      marginBottom: "20px",
      padding: "10px",
      width: "100%",
      borderRadius: "6px",
      border: "1px solid #ccc",
      resize: "vertical",
    },
    button: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#198754",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      fontWeight: "600",
      cursor: "pointer",
    },
    message: {
      marginTop: "20px",
      textAlign: "center",
      fontWeight: "bold",
    },
  };

  return (
    <>
      <NavbarEmployer />
      <div style={styles.container}>
        <div style={styles.card}>
          <h3 style={styles.heading}>Post a New Job</h3>
          <form onSubmit={handleSubmit}>
            <div>
              <label style={styles.label}>Job Title</label>
              <input
                type="text"
                name="title"
                value={job.title}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            <div>
              <label style={styles.label}>Location</label>
              <input
                type="text"
                name="location"
                value={job.location}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            <div>
              <label style={styles.label}>Salary (INR)</label>
              <input
                type="number"
                name="salary"
                value={job.salary}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            <div>
              <label style={styles.label}>Description</label>
              <textarea
                name="description"
                value={job.description}
                onChange={handleChange}
                style={styles.textarea}
                rows="4"
                required
              />
            </div>
            <div>
              <label style={styles.label}>Company</label>
              <input
                type="text"
                value={companyName}
                disabled
                style={{ ...styles.input, backgroundColor: "#f5f5f5" }}
              />
            </div>

            <button type="submit" style={styles.button}>Post Job</button>
            {message && <div style={styles.message}>{message}</div>}
          </form>
        </div>
      </div>
    </>
  );
};

export default PostJobs;
