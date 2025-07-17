package com.careercrafter.jobportal.controller;

import com.careercrafter.jobportal.entity.JobSeeker;
import com.careercrafter.jobportal.entity.Resume;
import com.careercrafter.jobportal.repo.JobSeekerRepo;
import com.careercrafter.jobportal.repo.ResumeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.List;

@RestController
@RequestMapping("/api/resumes")
public class ResumeRestController {

    @Autowired
    private ResumeRepo resumeRepo;

    @Autowired
    private JobSeekerRepo jobSeekerRepo;

    // Create resume manually (JSON body)
    @PostMapping
    public Resume create(@RequestBody Resume resume) {
        Long seekerId = resume.getJobSeeker().getId();
        JobSeeker jobSeeker = jobSeekerRepo.findById(seekerId).orElseThrow();
        resume.setJobSeeker(jobSeeker);
        return resumeRepo.save(resume);
    }

    @GetMapping
    public List<Resume> getAll() {
        return resumeRepo.findAll();
    }

    @GetMapping("/{id}")
    public Resume getById(@PathVariable Long id) {
        return resumeRepo.findById(id).orElseThrow();
    }

    @PutMapping("/{id}")
    public Resume update(@PathVariable Long id, @RequestBody Resume updated) {
        Resume resume = resumeRepo.findById(id).orElseThrow();
        resume.setFileUrl(updated.getFileUrl());
        resume.setFileType(updated.getFileType());
        resume.setDescription(updated.getDescription());
        resume.setJobSeeker(updated.getJobSeeker());
        return resumeRepo.save(resume);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        resumeRepo.deleteById(id);
    }

    // Upload resume with file + description + seekerId
    @PostMapping("/upload")
    public String uploadResume(@RequestParam("file") MultipartFile file,
                               @RequestParam("description") String description,
                               @RequestParam("seekerId") Long seekerId) {
        try {
            JobSeeker jobSeeker = jobSeekerRepo.findById(seekerId).orElseThrow();

            String fileName = file.getOriginalFilename();
            String fileType = file.getContentType();

            // Ensure the uploads/resumes folder exists
            File uploadDir = new File("uploads/resumes");
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            // Save the file to uploads/resumes/
            Path filePath = Paths.get("uploads/resumes", fileName);
            Files.write(filePath, file.getBytes(), StandardOpenOption.CREATE);

            // Save resume info to database
            Resume resume = new Resume();
            resume.setFileUrl("uploads/resumes/" + fileName); // Relative path to be served
            resume.setFileType(fileType);
            resume.setDescription(description);
            resume.setJobSeeker(jobSeeker);

            resumeRepo.save(resume);

            return "Resume uploaded and saved!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Upload failed: " + e.getMessage();
        }
    }
    @GetMapping("/seeker/{seekerId}")
    public List<Resume> getResumesBySeeker(@PathVariable Long seekerId) {
        return resumeRepo.findByJobSeekerId(seekerId);
    }

}
