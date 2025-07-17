package com.careercrafter.jobportal.controller;

import com.careercrafter.jobportal.entity.Job;
import com.careercrafter.jobportal.repo.JobRepo;
import com.careercrafter.jobportal.service.EmailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobRestController {

    @Autowired private JobRepo jobRepo;
    @Autowired private EmailService emailService;

    @PostMapping
    public Job create(@RequestBody Job job) {
        Job saved = jobRepo.save(job);

        String subject = "🔔 New Job Posted: \"" + saved.getTitle() + "\" on CareerCrafter";

        String body = String.format("""
            Dear Sam,

            A new job listing has been submitted on the CareerCrafter platform and is pending your review.

            ─────────────────────────────
            📌 Job Title    : %s
            🏢 Location     : %s
            💼 Employer     : %s
            💲 Salary       : %s
            🗒️ Description  : %s
            🏢 Company      : Hexaware
            ─────────────────────────────

            🔗 Please log in to the User dashboard to review or take action on this posting.

            Best regards,  
            CareerCrafter Notification System  
            📧 admin@gmail.com  
            """,
            saved.getTitle(),
            saved.getLocation(),
            saved.getEmployerEmail(),
            (saved.getSalary() != null && !saved.getSalary().isBlank()) ? saved.getSalary() : "Not disclosed",
            saved.getDescription()
        );

        emailService.sendEmail("ksamikksha@gmail.com", subject, body);

        return saved;
    }

    @GetMapping
    public List<Job> getAllJobs() {
        return jobRepo.findAll();
    }

    @GetMapping("/{id}")
    public Job getById(@PathVariable Long id) {
        return jobRepo.findById(id).orElseThrow();
    }

    @PutMapping("/{id}")
    public Job update(@PathVariable Long id, @RequestBody Job updated) {
        Job j = jobRepo.findById(id).orElseThrow();
        j.setTitle(updated.getTitle());
        j.setDescription(updated.getDescription());
        j.setLocation(updated.getLocation());
        j.setSalary(updated.getSalary());
        j.setEmployerEmail(updated.getEmployerEmail());
        return jobRepo.save(j);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        jobRepo.deleteById(id);
    }

    @GetMapping("/employer/{email}")
    public List<Job> getJobsByEmployerEmail(@PathVariable String email) {
        return jobRepo.findByEmployerEmail(email);
    }
}
