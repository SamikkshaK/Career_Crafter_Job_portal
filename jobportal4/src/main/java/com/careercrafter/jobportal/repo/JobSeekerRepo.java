package com.careercrafter.jobportal.repo;

import com.careercrafter.jobportal.entity.JobSeeker;
import com.careercrafter.jobportal.entity.User;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface JobSeekerRepo extends JpaRepository<JobSeeker, Long> {
    JobSeeker findByEmail(String email);
    @Query(value = "SELECT * FROM users", nativeQuery = true)
    List<User> fetchAllUsersRaw();

}
