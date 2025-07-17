import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./components/Register";
import Login from "./components/Login";

import UserHome from "./components/UserHome";
import BrowseJobs from "./pages/BrowseJobs";
import ManageProfile from "./pages/ManageProfile";
import UploadResume from "./pages/UploadResume";
import MyApplications from "./pages/MyApplications";

import EmployerHome from "./components/EmployerHome";
import PostJob from "./pages/PostJobs";
import ManageJob from "./pages/ManageJobs";
import ViewApplications from "./pages/ViewApplications";
import UpdateCompany from "./pages/UpdateCompany";

import AdminHome from "./components/AdminHome";
import ManageUsers from "./pages/ManageUsers";
import ReviewJobs from "./pages/ReviewJobs";
import ReviewApplications from "./pages/ReviewApplications";

function App() {
  return (
    
      <Routes>
       
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/user/home" element={<UserHome />} />
        <Route path="/browse-jobs" element={<BrowseJobs />} />
        <Route path="/manage-profile" element={<ManageProfile />} />
        <Route path="/upload-resume" element={<UploadResume />} />
        <Route path="/my-applications" element={<MyApplications />} />

        <Route path="/employer/home" element={<EmployerHome />} />
        <Route path="/employer/post-job" element={<PostJob />} />
        <Route path="/employer/manage-job" element={<ManageJob />} />
        <Route path="/employer/applications" element={<ViewApplications />} />
        <Route path="/employer/update-company" element={<UpdateCompany />} />

        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/jobs" element={<ReviewJobs />} />
        <Route path="/admin/applications" element={<ReviewApplications />} />
      </Routes>
   
  );
}

export default App;
