import React, { useEffect, useState } from "react";
import NavbarEmployer from "../components/NavbarEmployer";

const ViewApplications = () => {
  const [applications, setApplications] = useState([]);
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/employers/employer/${email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setApplications(data);
        } else {
          console.error("Unauthorized or failed to fetch applications");
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    if (email && token) fetchApplications();
  }, [email, token]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:8080/api/applications/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        alert("✅ Status updated");
        setApplications((prev) =>
          prev.map((app) =>
            app.applicationId === id ? { ...app, status: newStatus } : app
          )
        );
      } else {
        const msg = await res.text();
        console.error("Status update failed:", msg);
        alert("❌ Failed to update status");
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("⚠️ Network error");
    }
  };

  const styles = {
    container: {
      maxWidth: "1100px",
      margin: "50px auto",
      padding: "30px",
      backgroundColor: "#fff",
      borderRadius: "12px",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
      fontFamily: "'Segoe UI', sans-serif",
    },
    heading: {
      textAlign: "center",
      fontSize: "28px",
      fontWeight: "bold",
      color: "#0d6efd",
      marginBottom: "30px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    th: {
      backgroundColor: "#000000",
      color: "#fff",
      padding: "12px",
      border: "1px solid #ddd",
      fontSize: "16px",
      textAlign: "center",
    },
    td: {
      padding: "10px",
      border: "1px solid #ccc",
      fontSize: "15px",
      textAlign: "center",
      backgroundColor: "#f9f9f9",
    },
    tdAlt: {
      backgroundColor: "#ffffff",
    },
    select: {
      padding: "6px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontSize: "14px",
    },
    link: {
      color: "#0d6efd",
      fontWeight: "bold",
      textDecoration: "none",
    },
    noData: {
      textAlign: "center",
      padding: "20px",
      color: "#777",
      fontSize: "16px",
    },
  };

  return (
    <>
      <NavbarEmployer />
      <div style={styles.container}>
        <h3 style={styles.heading}>Job Applications Received</h3>

        {applications.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Job Title</th>
                <th style={styles.th}>Applicant Email</th>
                <th style={styles.th}>Applied Date</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Resume</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app, index) => (
                <tr key={app.applicationId}>
                  <td style={index % 2 === 0 ? styles.td : { ...styles.td, ...styles.tdAlt }}>
                    {app.job?.title}
                  </td>
                  <td style={index % 2 === 0 ? styles.td : { ...styles.td, ...styles.tdAlt }}>
                    {app.seekerEmail}
                  </td>
                  <td style={index % 2 === 0 ? styles.td : { ...styles.td, ...styles.tdAlt }}>
                    {app.appliedDate}
                  </td>
                  <td style={index % 2 === 0 ? styles.td : { ...styles.td, ...styles.tdAlt }}>
                    <select
                      style={styles.select}
                      value={app.status}
                      onChange={(e) =>
                        handleStatusChange(app.applicationId, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Under Review">Under Review</option>
                    </select>
                  </td>
                  <td style={index % 2 === 0 ? styles.td : { ...styles.td, ...styles.tdAlt }}>
                    {app.resumePath ? (
                      <a
                        href={`http://localhost:8080/${app.resumePath}`}
                        target="_blank"
                        rel="noreferrer"
                        style={styles.link}
                      >
                        View Resume
                      </a>
                    ) : (
                      "No Resume"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={styles.noData}>No applications submitted yet.</div>
        )}
      </div>
    </>
  );
};

export default ViewApplications;
