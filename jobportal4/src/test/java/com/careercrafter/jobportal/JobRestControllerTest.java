package com.careercrafter.jobportal;

import com.careercrafter.jobportal.entity.Company;
import com.careercrafter.jobportal.entity.User;
import com.careercrafter.jobportal.repo.CompanyRepo;
import com.careercrafter.jobportal.repo.JobRepo;
import com.careercrafter.jobportal.repo.UserRepo;
import com.careercrafter.jobportal.service.EmailService;
import com.careercrafter.jobportal.JwtTestUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import jakarta.transaction.Transactional;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
@Transactional
@Rollback
public class JobRestControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private JobRepo jobRepo;
    @Autowired private CompanyRepo companyRepo;
    @Autowired private JwtTestUtil jwtTestUtil;
    @Autowired
    private UserRepo userRepo; 

    @MockBean private EmailService emailService;

    private String token;

    @BeforeEach
    void setup() {
        if (!userRepo.existsByEmail("hr@testco.com")) {
            User employer = new User();
            employer.setEmail("hr@testco.com");
            employer.setPassword("dummy");
            employer.setRole(User.Role.EMPLOYER);
            employer.setFullName("HR Person");
            userRepo.save(employer);
        }

        token = jwtTestUtil.getToken("hr@testco.com", User.Role.EMPLOYER);
    }


    @Test
    public void testCreateJobAndFetchAll() throws Exception {
        Company company = new Company();
        company.setCompanyName("TestCo");
        company.setIndustry("Tech");
        company.setLocation("Chennai");
        Company savedCompany = companyRepo.save(company);

        String requestBody = String.format("""
        {
            "title": "Backend Developer",
            "description": "Build APIs using Spring Boot",
            "location": "Remote",
            "salary": "120000",
            "employerEmail": "hr@testco.com",
            "company": { "companyId": %d }
        }
        """, savedCompany.getCompanyId());

        mockMvc.perform(post("/api/jobs")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Backend Developer")))
                .andExpect(jsonPath("$.location", is("Remote")));

        mockMvc.perform(get("/api/jobs")
                .header("Authorization", token))  // ✅ this was missing
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title", is("Backend Developer")));
    }
}