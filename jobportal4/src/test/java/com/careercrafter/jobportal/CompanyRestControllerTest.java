package com.careercrafter.jobportal;

import com.careercrafter.jobportal.entity.Company;
import com.careercrafter.jobportal.repo.CompanyRepo;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.*;
import com.careercrafter.jobportal.JwtTestUtil;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS) 
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class CompanyRestControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private CompanyRepo companyRepo;
    @Autowired private JwtTestUtil jwtTestUtil;

    private static Long companyId;
    private String token;

    @BeforeEach
    void setup() {
        token = jwtTestUtil.getToken("employer@example.com", com.careercrafter.jobportal.entity.User.Role.EMPLOYER);
    }

    @Test @Order(1)
    public void testCreateCompany() throws Exception {
    	Company company = new Company();
    	company.setCompanyName("OpenAI Ltd");
    	company.setLocation("San Francisco");
    	company.setIndustry("AI Research");

        MvcResult result = mockMvc.perform(post("/api/companies")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(company)))
            .andExpect(status().isOk())
            .andReturn();

        companyId = objectMapper.readTree(result.getResponse().getContentAsString()).get("companyId").asLong();
    }

    @Test @Order(2)
    public void testGetCompanyById() throws Exception {
        mockMvc.perform(get("/api/companies/" + companyId)
            .header("Authorization", token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.companyName").value("OpenAI Ltd"));
    }

    @Test @Order(3)
    public void testUpdateCompany() throws Exception {
    	Company updated = new Company();
    	updated.setCompanyName("OpenAI Global");
    	updated.setLocation("USA");
    	updated.setIndustry("Advanced AI");


        mockMvc.perform(put("/api/companies/" + companyId)
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updated)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.industry").value("Advanced AI"));
    }

    @Test @Order(4)
    public void testDeleteCompany() throws Exception {
        mockMvc.perform(delete("/api/companies/" + companyId)
            .header("Authorization", token))
            .andExpect(status().isOk());
    }
}
