import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarMain from './NavBarMain';

const Register = () => {
  const [inputs, setInputs] = useState({
    fullName: '',
    email: '',
    password: '',
    role: '',
    education: '',
    experience: '',
    resumeLink: '',
    designation: '',
    phone: '',
    companyName: '',
    industry: '',
    location: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
      });

      if (response.ok) {
        setMessage('✅ Registration successful! Redirecting...');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        const errorText = await response.text();
        setMessage(`❌ Registration failed: ${errorText}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Error occurred during registration.');
    }
  };

  const { role } = inputs;

  return (
    <>
      <NavbarMain />
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="card p-4 shadow-lg" style={{ width: '100%', maxWidth: '500px' }}>
          <h3 className="text-center text-primary mb-3">Register</h3>

          <form onSubmit={handleSubmit}>
            {/* Basic Fields */}
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="fullName"
                className="form-control"
                value={inputs.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={inputs.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={inputs.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Role Selection */}
            <div className="mb-3">
              <label className="form-label">Register As</label>
              <select
                name="role"
                className="form-select"
                value={inputs.role}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Role --</option>
                <option value="JOB_SEEKER">Job Seeker</option>
                <option value="EMPLOYER">Employer</option>
              </select>
            </div>

            {/* Job Seeker Fields */}
            {role === 'JOB_SEEKER' && (
              <>
                <div className="mb-3">
                  <label className="form-label">Education</label>
                  <input
                    type="text"
                    name="education"
                    className="form-control"
                    value={inputs.education}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Experience</label>
                  <input
                    type="text"
                    name="experience"
                    className="form-control"
                    value={inputs.experience}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Resume Link</label>
                  <input
                    type="text"
                    name="resumeLink"
                    className="form-control"
                    value={inputs.resumeLink}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            {/* Employer Fields */}
            {role === 'EMPLOYER' && (
              <>
                <div className="mb-3">
                  <label className="form-label">Designation</label>
                  <input
                    type="text"
                    name="designation"
                    className="form-control"
                    value={inputs.designation}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-control"
                    value={inputs.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    className="form-control"
                    value={inputs.companyName}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Industry</label>
                  <input
                    type="text"
                    name="industry"
                    className="form-control"
                    value={inputs.industry}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    name="location"
                    className="form-control"
                    value={inputs.location}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn btn-success">Register</button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate('/login')}
              >
                Already have an account? Login
              </button>
            </div>

            {message && (
              <div className="alert alert-info mt-4 text-center">{message}</div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
