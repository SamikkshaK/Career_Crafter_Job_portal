package com.careercrafter.jobportal.controller;

import com.careercrafter.jobportal.dto.AuthResponse;
import com.careercrafter.jobportal.dto.LoginRequest;
import com.careercrafter.jobportal.dto.RegisterRequest;
import com.careercrafter.jobportal.entity.*;
import com.careercrafter.jobportal.repo.*;
import com.careercrafter.jobportal.security.JwtUtil;
import com.careercrafter.jobportal.service.CustomUserDetailsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired private AuthenticationManager authManager;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private CustomUserDetailsService userDetailsService;
    @Autowired private PasswordEncoder passwordEncoder;

    @Autowired private UserRepo userRepo;
    @Autowired private JobSeekerRepo jobSeekerRepo;
    @Autowired private EmployerRepo employerRepo;
    @Autowired private CompanyRepo companyRepo;

    // ✅ Registration for both JOB_SEEKER and EMPLOYER
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            if (userRepo.findByEmail(request.getEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already registered");
            }

            if (request.getRole().equalsIgnoreCase("JOB_SEEKER")) {
                JobSeeker js = new JobSeeker();
                js.setEmail(request.getEmail());
                js.setPassword(passwordEncoder.encode(request.getPassword()));
                js.setFullName(request.getFullName());
                js.setRole(User.Role.JOB_SEEKER);
                js.setEducation(request.getEducation());
                js.setExperience(request.getExperience());
                js.setResumeLink(request.getResumeLink());

                jobSeekerRepo.save(js);
                return ResponseEntity.ok("Job Seeker registered successfully!");
            }

            if (request.getRole().equalsIgnoreCase("EMPLOYER")) {
                Company company = companyRepo.findByCompanyNameAndLocation(
                        request.getCompanyName(), request.getLocation()
                ).orElseGet(() -> {
                    Company newCompany = new Company();
                    newCompany.setCompanyName(request.getCompanyName());
                    newCompany.setIndustry(request.getIndustry());
                    newCompany.setLocation(request.getLocation());
                    return companyRepo.save(newCompany);
                });

                Employer emp = new Employer();
                emp.setEmail(request.getEmail());
                emp.setPassword(passwordEncoder.encode(request.getPassword()));
                emp.setFullName(request.getFullName());
                emp.setRole(User.Role.EMPLOYER);
                emp.setDesignation(request.getDesignation());
                emp.setPhone(request.getPhone());
                emp.setEmployerEmail(request.getEmail());
                emp.setCompany(company);

                employerRepo.save(emp);
                return ResponseEntity.ok("Employer registered successfully!");
            }

            return ResponseEntity.badRequest().body("Invalid role");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Registration failed: " + e.getMessage());
        }
    }

    // ✅ JWT-based Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        Optional<User> optionalUser = userRepo.findByEmail(loginRequest.getEmail());

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            System.out.println("🔍 Found user: " + user.getEmail() + " | Role: " + user.getRole());
            System.out.println("🔐 Hashed Password: " + user.getPassword());
            System.out.println("🔐 Input Password: " + loginRequest.getPassword());

            boolean match = passwordEncoder.matches(loginRequest.getPassword(), user.getPassword());
            System.out.println("✅ Password match: " + match);

            if (match) {
                String token = jwtUtil.generateToken(user.getEmail(), user.getRole().toString());
                return ResponseEntity.ok(new AuthResponse(token, user.getRole().toString()));
            }
        } else {
            System.out.println("❌ User not found for: " + loginRequest.getEmail());
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
    }
    @PostMapping("/register-admin")
    public ResponseEntity<String> registerAdmin(@RequestBody RegisterRequest request) {
        if (userRepo.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Admin already exists!");
        }

        User admin = new User();
        admin.setEmail(request.getEmail());
        admin.setFullName(request.getFullName());
        admin.setPassword(passwordEncoder.encode(request.getPassword()));
        admin.setRole(User.Role.ADMIN);

        userRepo.save(admin);
        return ResponseEntity.ok("✅ Admin registered successfully!");
    }




}