import React, { useEffect, useState } from "react";
import NavbarMain from "../components/NavbarAdmin";

const ManageUsers = () => {
  const [jobSeekers, setJobSeekers] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
    education: "",
    experience: "",
    resumeLink: "",
    designation: "",
    phone: "",
    companyName: "",
    companyIndustry: "",
    companyLocation: ""
  });

  const fetchUsers = async () => {
    try {
      const seekersRes = await fetch("http://localhost:8080/api/jobseekers", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const employersRes = await fetch("http://localhost:8080/api/employers", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const seekersData = await seekersRes.json();
      const employersData = await employersRes.json();

      setJobSeekers(seekersData);
      setEmployers(employersData);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        fetchUsers();
        alert("✅ User registered!");
        setForm({
          fullName: "",
          email: "",
          password: "",
          role: "",
          education: "",
          experience: "",
          resumeLink: "",
          designation: "",
          phone: "",
          companyName: "",
          companyIndustry: "",
          companyLocation: ""
        });
        setShowForm(false);
      } else {
        const errorText = await response.text();
        alert("❌ Registration failed: " + errorText);
      }
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    const url = type === "seeker"
      ? `http://localhost:8080/api/jobseekers/${id}`
      : `http://localhost:8080/api/employers/${id}`;

    try {
      await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  const styles = {
    container: {
      maxWidth: "1000px",
      margin: "40px auto",
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      fontFamily: "Segoe UI, sans-serif",
    },
    sectionTitle: {
      marginTop: "20px",
      color: "#0d6efd",
      fontWeight: "bold",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "10px",
    },
    th: {
      backgroundColor: "#0d6efd",
      color: "white",
      padding: "10px",
      textAlign: "center",
    },
    td: {
      padding: "8px",
      textAlign: "center",
      borderBottom: "1px solid #ddd",
    },
    btnDelete: {
      backgroundColor: "#dc3545",
      color: "white",
      border: "none",
      padding: "6px 12px",
      borderRadius: "4px",
      cursor: "pointer",
    },
    btnAdd: {
      backgroundColor: "#198754",
      color: "white",
      padding: "10px 15px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      marginBottom: "15px",
    },
    formContainer: {
      marginBottom: "30px",
      backgroundColor: "#f8f9fa",
      padding: "15px",
      borderRadius: "8px",
    },
    input: {
      width: "100%",
      padding: "8px",
      marginBottom: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    },
  };

  return (
    <>
      <NavbarMain />
      <div style={styles.container}>
        <h2 style={styles.sectionTitle}>Manage Users</h2>

        <button style={styles.btnAdd} onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "➕ Add User"}
        </button>

        {showForm && (
          <div style={styles.formContainer}>
            <form onSubmit={handleAddUser}>
              <input type="text" name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleInputChange} style={styles.input} required />
              <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleInputChange} style={styles.input} required />
              <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleInputChange} style={styles.input} required />

              <select name="role" value={form.role} onChange={handleInputChange} style={styles.input} required>
                <option value="">-- Select Role --</option>
                <option value="JOB_SEEKER">Job Seeker</option>
                <option value="EMPLOYER">Employer</option>
              </select>

              {form.role === "JOB_SEEKER" && (
                <>
                  <input type="text" name="education" placeholder="Education" value={form.education} onChange={handleInputChange} style={styles.input} />
                  <input type="text" name="experience" placeholder="Experience" value={form.experience} onChange={handleInputChange} style={styles.input} />
                  <input type="text" name="resumeLink" placeholder="Resume Link" value={form.resumeLink} onChange={handleInputChange} style={styles.input} />
                </>
              )}

              {form.role === "EMPLOYER" && (
                <>
                  <input type="text" name="designation" placeholder="Designation" value={form.designation} onChange={handleInputChange} style={styles.input} />
                  <input type="text" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleInputChange} style={styles.input} />
                  <input type="text" name="companyName" placeholder="Company Name" value={form.companyName} onChange={handleInputChange} style={styles.input} />
                  <input type="text" name="companyIndustry" placeholder="Company Industry" value={form.companyIndustry} onChange={handleInputChange} style={styles.input} />
                  <input type="text" name="companyLocation" placeholder="Company Location" value={form.companyLocation} onChange={handleInputChange} style={styles.input} />
                </>
              )}

              <button type="submit" style={styles.btnAdd}>Register</button>
            </form>
          </div>
        )}

        <h3 style={styles.sectionTitle}>Job Seekers</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobSeekers.map((seeker) => (
              <tr key={seeker.id}>
                <td style={styles.td}>{seeker.id}</td>
                <td style={styles.td}>{seeker.fullName}</td>
                <td style={styles.td}>{seeker.email}</td>
                <td style={styles.td}>
                  <button style={styles.btnDelete} onClick={() => handleDelete("seeker", seeker.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 style={styles.sectionTitle}>Employers</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employers.map((employer) => (
              <tr key={employer.id}>
                <td style={styles.td}>{employer.id}</td>
                <td style={styles.td}>{employer.fullName}</td>
                <td style={styles.td}>{employer.email}</td>
                <td style={styles.td}>
                  <button style={styles.btnDelete} onClick={() => handleDelete("employer", employer.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ManageUsers;
