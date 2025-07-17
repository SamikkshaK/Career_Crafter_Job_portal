package com.careercrafter.jobportal;

import com.careercrafter.jobportal.entity.User;
import com.careercrafter.jobportal.repo.UserRepo;
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
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class UserRestControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private UserRepo userRepo;
    @Autowired private JwtTestUtil jwtTestUtil;
    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;


    private String token;

    @BeforeAll
    void setup() {
        if (!userRepo.existsByEmail("user@example.com")) {
            User user = new User();
            user.setFullName("Test User");
            user.setEmail("user@example.com");
            user.setPassword(passwordEncoder.encode("1234")); 
            user.setRole(User.Role.JOB_SEEKER);
            userRepo.save(user);
        }
        token = jwtTestUtil.getToken("user@example.com", User.Role.JOB_SEEKER);
    }


    @Test @Order(1)
    public void testRegisterUser() throws Exception {
        User newUser = new User();
        newUser.setFullName("New User");
        newUser.setEmail("newuser@example.com");
        newUser.setPassword("abcd1234");
        newUser.setRole(User.Role.JOB_SEEKER);

        mockMvc.perform(post("/api/auth/register")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newUser)))
            .andExpect(status().isOk())
            .andExpect(content().string("Job Seeker registered successfully!"));

    }

    @Test @Order(2)
    public void testLoginUser() throws Exception {
        User login = new User();
        login.setEmail("user@example.com");
        login.setPassword("1234");

        mockMvc.perform(post("/api/auth/login")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(login)))
            .andExpect(status().isOk())
            .andExpect(content().string(org.hamcrest.Matchers.containsString("token")));
    }

    @Test @Order(3)
    public void testGetUserProfileById() throws Exception {
        Long id = userRepo.findByEmail("user@example.com").get().getId();

        mockMvc.perform(get("/api/users/" + id)
                .header("Authorization", token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.email").value("user@example.com"));
    }
}
