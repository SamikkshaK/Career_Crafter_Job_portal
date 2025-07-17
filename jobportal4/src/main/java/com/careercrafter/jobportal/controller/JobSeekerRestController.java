package com.careercrafter.jobportal.controller;

import com.careercrafter.jobportal.entity.JobSeeker;
import com.careercrafter.jobportal.repo.JobSeekerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/jobseekers")
public class JobSeekerRestController {

    @Autowired private JobSeekerRepo jobSeekerRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;


    @PostMapping
    public JobSeeker create(@RequestBody JobSeeker seeker) {
        return jobSeekerRepo.save(seeker);
    }

    @GetMapping
    public List<JobSeeker> getAll() {
        return jobSeekerRepo.findAll();
    }

    @GetMapping("/{id}")
    public JobSeeker getById(@PathVariable Long id) {
        return jobSeekerRepo.findById(id).orElseThrow();
    }
//
//    @PutMapping("/{id}")
//    public JobSeeker update(@PathVariable Long id, @RequestBody JobSeeker updated) {
//        JobSeeker seeker = jobSeekerRepo.findById(id).orElseThrow();
//        seeker.setFullName(updated.getFullName());
//        seeker.setEmail(updated.getEmail());
//        seeker.setPassword(updated.getPassword());
//        seeker.setRole(updated.getRole());
//        seeker.setEducation(updated.getEducation());
//        seeker.setExperience(updated.getExperience());
//        seeker.setResumeLink(updated.getResumeLink());
//        return jobSeekerRepo.save(seeker);
//    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        jobSeekerRepo.deleteById(id);
    }
 // In JobSeekerRestController
    @GetMapping("/by-email/{email}")
    public ResponseEntity<JobSeeker> getByEmail(@PathVariable String email) {
        JobSeeker seeker = jobSeekerRepo.findByEmail(email);
        if (seeker == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(seeker);
    }
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('JOB_SEEKER')") // Optional if allowed in config above
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody JobSeeker updatedSeeker, Principal principal) {
        Optional<JobSeeker> existing = jobSeekerRepo.findById(id);

        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        JobSeeker js = existing.get();

        // ✅ Optional: ensure current user is editing only their own profile
        if (!js.getEmail().equals(principal.getName())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not allowed to edit others");
        }

        js.setFullName(updatedSeeker.getFullName());
        if (updatedSeeker.getPassword() != null && !updatedSeeker.getPassword().isBlank()) {
            js.setPassword(passwordEncoder.encode(updatedSeeker.getPassword()));
        }

        js.setEducation(updatedSeeker.getEducation());
        js.setExperience(updatedSeeker.getExperience());
        js.setResumeLink(updatedSeeker.getResumeLink());

        jobSeekerRepo.save(js);
        return ResponseEntity.ok("Profile updated");
    }
    @PutMapping("/update")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<?> updateSelf(@RequestBody JobSeeker updatedSeeker, Principal principal) {
        JobSeeker js = jobSeekerRepo.findByEmail(principal.getName());
        if (js == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");

        js.setFullName(updatedSeeker.getFullName());
        js.setPassword(passwordEncoder.encode(updatedSeeker.getPassword()));
        js.setEducation(updatedSeeker.getEducation());
        js.setExperience(updatedSeeker.getExperience());
        js.setResumeLink(updatedSeeker.getResumeLink());

        jobSeekerRepo.save(js);
        return ResponseEntity.ok("Profile updated");
    }




}
