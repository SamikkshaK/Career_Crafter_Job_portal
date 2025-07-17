package com.careercrafter.jobportal.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.careercrafter.jobportal.entity.Application;
import com.careercrafter.jobportal.entity.Employer;
import com.careercrafter.jobportal.entity.Job;
import com.careercrafter.jobportal.entity.JobSeeker;
import com.careercrafter.jobportal.entity.Resume;
import com.careercrafter.jobportal.repo.ApplicationRepo;
import com.careercrafter.jobportal.repo.EmployerRepo;
import com.careercrafter.jobportal.repo.JobRepo;
import com.careercrafter.jobportal.repo.JobSeekerRepo;
import com.careercrafter.jobportal.repo.ResumeRepo;

@RestController
@RequestMapping("/api/admin")
public class AdminRestController {
    @Autowired private JobSeekerRepo jobSeekerRepo;
    @Autowired private EmployerRepo employerRepo;
    @Autowired private JobRepo jobRepo;
    @Autowired private ApplicationRepo applicationRepo;
    @Autowired private ResumeRepo resumeRepo;

    @GetMapping("/jobseekers")
    public List<JobSeeker> getAllJobSeekers() {
        return jobSeekerRepo.findAll();
    }

    @GetMapping("/employers")
    public List<Employer> getAllEmployers() {
        return employerRepo.findAll();
    }

    @GetMapping("/jobs")
    public List<Job> getAllJobs() {
        return jobRepo.findAll();
    }

//    @GetMapping("/applications")
//    public List<Application> getAllApplications() {
//        return applicationRepo.findAll();
//    }

    @DeleteMapping("/jobseeker/{id}")
    public void deleteJobSeeker(@PathVariable Long id) {
        jobSeekerRepo.deleteById(id);
    }

    @DeleteMapping("/employer/{id}")
    public void deleteEmployer(@PathVariable Long id) {
        employerRepo.deleteById(id);
    }

    @DeleteMapping("/job/{id}")
    public void deleteJob(@PathVariable Long id) {
        jobRepo.deleteById(id);
    }
    @GetMapping("/applications")
    public List<Application> getAllApplications() {
        List<Application> apps = applicationRepo.findAll();
        for (Application app : apps) {
            JobSeeker seeker = app.getJobSeeker();
            if (seeker != null) {
                Resume resume = resumeRepo.findTopByJobSeekerOrderByIdDesc(seeker);
                if (resume != null) {
                    app.setResumePath(resume.getFileUrl());
                }
            }
        }
        return apps;
    }
    @DeleteMapping("/application/{id}")
    public void deleteApplication(@PathVariable Long id) {
        applicationRepo.deleteById(id);
    }


}
