import React, { useEffect, useState } from "react";
import NavbarUser from "../components/NavbarUser";

const MyApplications = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/applications/seeker/${user?.email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setApplications(data);
        } else {
          console.error("Failed to fetch applications", await response.text());
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
      }
    };

    if (user?.email && token) {
      fetchApplications();
    }
  }, [user?.email, token]);

  const styles = {
    container: {
      maxWidth: "1000px",
      margin: "50px auto",
      padding: "30px",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
      fontFamily: "'Segoe UI', sans-serif",
    },
    heading: {
      textAlign: "center",
      fontSize: "28px",
      marginBottom: "25px",
      color: "#0d6efd",
      fontWeight: "bold",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    th: {
      backgroundColor: "#000000",
      color: "#fff",
      padding: "12px",
      textAlign: "center",
      fontSize: "16px",
      borderBottom: "2px solid #ddd",
    },
    td: {
      padding: "10px",
      textAlign: "center",
      fontSize: "15px",
      borderBottom: "1px solid #ccc",
      backgroundColor: "#f9f9f9",
    },
    tdAlt: {
      backgroundColor: "#ffffff",
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
      <NavbarUser />
      <div style={styles.container}>
        <h3 style={styles.heading}>Your Job Applications</h3>
        {applications.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Job Title</th>
                <th style={styles.th}>Your Email</th>
                <th style={styles.th}>Applied Date</th>
                <th style={styles.th}>Status</th>
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
                    {app.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={styles.noData}>You haven't applied to any jobs yet.</div>
        )}
      </div>
    </>
  );
};

export default MyApplications;
