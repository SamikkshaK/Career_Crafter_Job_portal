package com.careercrafter.jobportal.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
	@Table(name = "admins")
	public class Admin {
	  @Id
	  @GeneratedValue(strategy = GenerationType.IDENTITY)
	  private Long id;
	  private String email;
	  private String password;
	  private String role = "ADMIN";
	  // getters and setters
	  public Long getId() {
		  return id;
	  }
	  public void setId(Long id) {
		  this.id = id;
	  }
	  public String getEmail() {
		  return email;
	  }
	  public void setEmail(String email) {
		  this.email = email;
	  }
	  public String getPassword() {
		  return password;
	  }
	  public void setPassword(String password) {
		  this.password = password;
	  }
	  public String getRole() {
		  return role;
	  }
	  public void setRole(String role) {
		  this.role = role;
	  }
	  
	}



