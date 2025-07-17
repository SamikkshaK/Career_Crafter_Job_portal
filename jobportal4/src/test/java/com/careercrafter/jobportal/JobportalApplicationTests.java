package com.careercrafter.jobportal;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;



import com.careercrafter.jobportal.entity.JobSeeker;
import com.careercrafter.jobportal.entity.User.Role;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
public class JobportalApplicationTests  {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testJobSeekerRegistration() throws Exception {
        JobSeeker seeker = new JobSeeker();
        seeker.setEmail("testjs@example.com");
        seeker.setPassword("testpass");
        seeker.setFullName("Test Seeker");
        seeker.setRole(Role.JOB_SEEKER);
        

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(seeker)))
                .andExpect(status().isOk());
    }
    
}
