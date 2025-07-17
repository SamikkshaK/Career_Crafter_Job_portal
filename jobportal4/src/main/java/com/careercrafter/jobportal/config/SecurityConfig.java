package com.careercrafter.jobportal.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	
	@Autowired
	private JwtAuthenticationFilter jwtFilter;


	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
	    http
	        .cors().and()
	        .csrf().disable()
	        .authorizeHttpRequests(auth -> auth
	            //.requestMatchers("/api/auth/**", "/api/public/**","/uploads/**").permitAll()
	        		.requestMatchers("/api/public/**","/uploads/**").permitAll()
	            .requestMatchers("/api/companies/by-email/**").hasRole("EMPLOYER")
	            .requestMatchers(HttpMethod.GET, "/api/companies/by-email/**").hasAnyRole("EMPLOYER", "ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/companies/by-email/**").hasRole("EMPLOYER")
                .requestMatchers(HttpMethod.GET, "/api/jobseekers/**").hasAnyRole("JOB_SEEKER", "ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/jobseekers/**").hasRole("JOB_SEEKER")
                .requestMatchers(HttpMethod.GET, "/api/employers/by-email/**").hasAnyRole("EMPLOYER", "ADMIN")
                .requestMatchers("/api/auth/register-admin").permitAll()
                .requestMatchers("/api/auth/login", "/api/auth/register", "/api/auth/register-admin").permitAll()


                
	            .anyRequest().authenticated()
	        )
	        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
	        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class); // 🔥 ADD THIS LINE

	    return http.build();
	}

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
