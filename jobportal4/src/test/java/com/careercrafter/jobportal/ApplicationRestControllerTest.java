package com.careercrafter.jobportal;

import com.careercrafter.jobportal.entity.*;
import com.careercrafter.jobportal.repo.*;
import com.careercrafter.jobportal.JwtTestUtil;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class ApplicationRestControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private UserRepo userRepo;
    @Autowired private JobRepo jobRepo;
    @Autowired private EmployerRepo employerRepo;
    @Autowired private CompanyRepo companyRepo;
    @Autowired private ApplicationRepo applicationRepo;
    @Autowired private JwtTestUtil jwtTestUtil;

    private Company company;
    private Job job;
    private JobSeeker seeker;
    private String token;

    @Test
    @Order(1)
    void testSaveCompany() {
        company = new Company();
        company.setCompanyName("Tech Solutions");
        company.setIndustry("Software");
        company.setLocation("Remote");
        company = companyRepo.save(company);

        Assertions.assertNotNull(company.getCompanyId());
    }

    @Test
    @Order(2)
    void testSaveJob() {
        job = new Job();
        job.setTitle("Full Stack Developer");
        job.setDescription("Backend + Frontend role");
        job.setLocation("Remote");
        job.setSalary("10 LPA");
        job.setEmployerEmail("employer@example.com");
        job.setCompany(company);
        job = jobRepo.save(job);

        Assertions.assertNotNull(job.getId());
    }

    @Test
    @Order(3)
    void testSaveJobSeeker() {
        seeker = new JobSeeker();
        seeker.setFullName("Seeker A");
        seeker.setEmail("seeker@example.com");
        seeker.setPassword("test123");
        seeker.setRole(User.Role.JOB_SEEKER);
        seeker.setEducation("B.Tech");
        seeker.setExperience("3 years");
        seeker.setResumeLink("resume_seeker_a.pdf");
        seeker = userRepo.save(seeker);

        token = jwtTestUtil.getToken(seeker.getEmail(), seeker.getRole());

        Assertions.assertNotNull(seeker.getId());
        Assertions.assertNotNull(token);
    }

    @Test
    @Order(4)
    void testApplyToJob() throws Exception {
        Application application = new Application();
        application.setSeekerEmail(seeker.getEmail());
        application.setJob(job);
        application.setJobSeeker(seeker);
        application.setAppliedDate(LocalDate.now());
        application.setStatus("PENDING");

        mockMvc.perform(post("/api/applications")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(application)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.seekerEmail").value("seeker@example.com"))
            .andExpect(jsonPath("$.status").value("Pending"));
    }
}
