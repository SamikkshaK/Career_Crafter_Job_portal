package com.careercrafter.jobportal.controller;

import com.careercrafter.jobportal.entity.Application;
import com.careercrafter.jobportal.entity.Job;
import com.careercrafter.jobportal.entity.JobSeeker;
import com.careercrafter.jobportal.repo.ApplicationRepo;
import com.careercrafter.jobportal.repo.JobRepo;
import com.careercrafter.jobportal.repo.JobSeekerRepo;
import com.careercrafter.jobportal.service.EmailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationRestController {

    @Autowired private ApplicationRepo applicationRepo;
    @Autowired private JobRepo jobRepo;
    @Autowired private JobSeekerRepo jobSeekerRepo;
    @Autowired private EmailService emailService;

    @GetMapping
    public List<Application> getAll() {
        return applicationRepo.findAll();
    }

    @GetMapping("/{id}")
    public Application getById(@PathVariable Long id) {
        return applicationRepo.findById(id).orElseThrow();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        applicationRepo.deleteById(id);
    }

    @PostMapping
    public Application create(@RequestBody Application app) {
        Job job = jobRepo.findById(app.getJob().getId()).orElseThrow();
        JobSeeker seeker = jobSeekerRepo.findByEmail(app.getSeekerEmail());

        app.setJob(job);
        app.setJobSeeker(seeker);
        app.setAppliedDate(LocalDate.now());
        app.setStatus("Pending");

        return applicationRepo.save(app);
    }

    @GetMapping("/seeker/{email}")
    public List<Application> getBySeekerEmail(@PathVariable String email) {
        return applicationRepo.findBySeekerEmail(email);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Application> updateStatus(@PathVariable Long id, @RequestBody Application updatedApp){

        Application app = applicationRepo.findById(id).orElseThrow();
        app.setStatus(updatedApp.getStatus());
        applicationRepo.save(app);

        // ✅ Personalized email
        String seekerName = app.getJobSeeker().getFullName();  // assuming name field exists
        String jobTitle = app.getJob().getTitle();
        String status = app.getStatus();

        String subject = "Update on Your Application for " + jobTitle;

        String body = String.format("""
                Dear %s,

                We hope this message finds you well.

                We are writing to inform you that the status of your application for the position "%s" has been updated.

                📌 Current Status: %s

                Please log in to your CareerCrafter account for more details or to take further action.

                Thank you for applying. We appreciate your interest in this opportunity.

                Best regards,  
                CareerCrafter Recruitment Team
                """, seekerName != null ? seekerName : "Candidate", jobTitle, status);

        emailService.sendEmail(app.getSeekerEmail(), subject, body);

        return ResponseEntity.ok(app);
    }
}
