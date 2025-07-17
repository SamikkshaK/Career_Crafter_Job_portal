package com.careercrafter.jobportal;

import com.careercrafter.jobportal.entity.JobSeeker;
import com.careercrafter.jobportal.entity.User;
import com.careercrafter.jobportal.repo.JobSeekerRepo;
import com.careercrafter.jobportal.JwtTestUtil;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class JobSeekerRestControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private JobSeekerRepo jobSeekerRepo;
    @Autowired private JwtTestUtil jwtTestUtil;

    private Long seekerId;
    private String token;

    @BeforeEach
    void setup() {
        token = jwtTestUtil.getToken("sam@example.com", User.Role.JOB_SEEKER);
    }

    @Test
    @Order(1)
    public void testCreateJobSeeker() throws Exception {
        JobSeeker existing = jobSeekerRepo.findByEmail("sam@example.com");
        if (existing != null) {
            seekerId = existing.getId();  
            return;
        }

        JobSeeker seeker = new JobSeeker();
        seeker.setFullName("Samikksha");
        seeker.setEmail("sam@example.com");
        seeker.setPassword("1234");
        seeker.setRole(User.Role.JOB_SEEKER);
        seeker.setEducation("B.Tech");
        seeker.setExperience("1 year");
        seeker.setResumeLink("http://resume.test");

        MvcResult result = mockMvc.perform(post("/api/jobseekers")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(seeker)))
            .andExpect(status().isOk())
            .andReturn();

        seekerId = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();
    }

    @Test
    @Order(2)
    public void testGetJobSeekerById() throws Exception {
        mockMvc.perform(get("/api/jobseekers/" + seekerId)
                .header("Authorization", token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.fullName").value("Samikksha"));
    }

    @Test
    @Order(3)
    public void testUpdateJobSeeker() throws Exception {
        JobSeeker updated = new JobSeeker();
        updated.setFullName("Samikksha K");
        updated.setEmail("sam@example.com");
        updated.setPassword("newpass");
        updated.setRole(User.Role.JOB_SEEKER);
        updated.setEducation("MCA");
        updated.setExperience("2 years");
        updated.setResumeLink("http://resume.updated");

        mockMvc.perform(put("/api/jobseekers/" + seekerId)
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updated)))
        .andExpect(status().isOk())
        .andExpect(content().string("Profile updated"));

    }

    @Test
    @Order(4)
    public void testDeleteJobSeeker() throws Exception {
        mockMvc.perform(delete("/api/jobseekers/" + seekerId)
                .header("Authorization", token))
            .andExpect(status().isOk());
    }
}
