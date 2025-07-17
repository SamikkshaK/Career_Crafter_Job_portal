package com.careercrafter.jobportal.repo;

import com.careercrafter.jobportal.entity.User;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
    User findByEmailAndPassword(String email, String password);
    @Query(value = "SELECT * FROM users", nativeQuery = true)
    List<User> fetchAllUsersRaw();

}


