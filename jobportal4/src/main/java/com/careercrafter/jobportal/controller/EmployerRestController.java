package com.careercrafter.jobportal.controller;


import com.careercrafter.jobportal.entity.Application;
import com.careercrafter.jobportal.entity.Employer;
import com.careercrafter.jobportal.entity.JobSeeker;
import com.careercrafter.jobportal.entity.Resume;
import com.careercrafter.jobportal.repo.EmployerRepo;
import com.careercrafter.jobportal.repo.JobSeekerRepo;
import com.careercrafter.jobportal.repo.ResumeRepo;
import com.careercrafter.jobportal.repo.ApplicationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employers")
public class EmployerRestController {

    @Autowired private EmployerRepo employerRepo;
    @Autowired private ApplicationRepo applicationRepo;
    @Autowired
    private ResumeRepo resumeRepo;

    @Autowired
    private JobSeekerRepo jobSeekerRepo;

    @PostMapping
    public Employer create(@RequestBody Employer emp) {
        return employerRepo.save(emp);
    }

    @GetMapping
    public List<Employer> getAll() {
        return employerRepo.findAll();
    }

    @GetMapping("/{id}")
    public Employer getById(@PathVariable Long id) {
        return employerRepo.findById(id).orElseThrow();
    }
    
    


    @PutMapping("/{id}")
    public Employer update(@PathVariable Long id, @RequestBody Employer updated) {
        Employer emp = employerRepo.findById(id).orElseThrow();
        emp.setFullName(updated.getFullName());
        emp.setEmail(updated.getEmail());
        emp.setPassword(updated.getPassword());
        emp.setRole(updated.getRole());
        emp.setDesignation(updated.getDesignation());
        emp.setPhone(updated.getPhone());
        emp.setCompany(updated.getCompany());
        return employerRepo.save(emp);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        employerRepo.deleteById(id);
    }
    @GetMapping("/employer/{email}")
    public ResponseEntity<List<Application>> getApplicationsForEmployer(@PathVariable String email) {
        List<Application> applications = applicationRepo.findByJob_EmployerEmail(email);

        for (Application app : applications) {
            JobSeeker seeker = app.getJobSeeker();
            if (seeker != null) {
                Resume resume = resumeRepo.findTopByJobSeekerOrderByIdDesc(seeker); // Get latest resume
                if (resume != null) {
                    app.setResumePath(resume.getFileUrl());
                }
            }
        }

        return ResponseEntity.ok(applications);
    }
    @GetMapping("/by-email/{email}")
    public ResponseEntity<Employer> getByEmail(@PathVariable String email) {
        Employer employer = employerRepo.findByEmail(email);
        if (employer == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(employer);
    }


}
