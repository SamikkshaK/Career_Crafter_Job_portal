package com.careercrafter.jobportal;

import com.careercrafter.jobportal.entity.User;
import com.careercrafter.jobportal.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class JwtTestUtil {
    @Autowired
    private JwtUtil jwtTokenUtil;

    public String getToken(String email, User.Role role) {
        return "Bearer " + jwtTokenUtil.generateToken(email, role.name());
    }
}
