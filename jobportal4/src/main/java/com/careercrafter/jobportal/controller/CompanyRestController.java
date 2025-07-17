package com.careercrafter.jobportal.controller;

import com.careercrafter.jobportal.entity.Company;
import com.careercrafter.jobportal.entity.Employer;
import com.careercrafter.jobportal.repo.CompanyRepo;
import com.careercrafter.jobportal.repo.EmployerRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
public class CompanyRestController {

    @Autowired private CompanyRepo companyRepo;
    @Autowired private EmployerRepo employerRepo;

    @PostMapping
    public Company create(@RequestBody Company company) {
        return companyRepo.save(company);
    }

    @GetMapping
    public List<Company> getAll() {
        return companyRepo.findAll();
    }

    @GetMapping("/{id}")
    public Company getById(@PathVariable Long id) {
        return companyRepo.findById(id).orElseThrow();
    }

    @PutMapping("/{id}")
    public Company update(@PathVariable Long id, @RequestBody Company updated) {
        Company c = companyRepo.findById(id).orElseThrow();
        c.setCompanyName(updated.getCompanyName());
        c.setLocation(updated.getLocation());
        c.setIndustry(updated.getIndustry());
        return companyRepo.save(c);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        companyRepo.deleteById(id);
    }
    @GetMapping("/by-email/{email}")
    public ResponseEntity<Company> getCompanyByEmployerEmail(@PathVariable String email) {
        Employer employer = employerRepo.findByEmail(email);
        if (employer == null || employer.getCompany() == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(employer.getCompany());
    }
    @PutMapping("/by-email/{email}")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<?> updateCompanyByEmail(
            @PathVariable String email,
            @RequestBody Company updatedCompany
    ) {
        Company existingCompany = companyRepo.findByEmployers_Email(email);
        if (existingCompany == null) {
            return ResponseEntity.notFound().build();
        }

        existingCompany.setCompanyName(updatedCompany.getCompanyName());
        existingCompany.setIndustry(updatedCompany.getIndustry());
        existingCompany.setLocation(updatedCompany.getLocation());

        companyRepo.save(existingCompany);

        return ResponseEntity.ok("✅ Company updated successfully");
    }

}
