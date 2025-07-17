package com.careercrafter.jobportal.repo;

import com.careercrafter.jobportal.entity.Company;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepo extends JpaRepository<Company, Long> {
	Company findByEmployers_Email(String email);
	Optional<Company> findByCompanyNameAndLocation(String companyName, String location);
    
}
