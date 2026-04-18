package com.logmonitor.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthRegisterRequest {

    @NotBlank(message = "username is required")
    @Size(min = 3, max = 64, message = "username must be between 3 and 64 characters")
    private String username;

    @NotBlank(message = "password is required")
    @Size(min = 6, max = 128, message = "password must be between 6 and 128 characters")
    private String password;

    @Size(max = 128, message = "email must be at most 128 characters")
    private String email;

    @Size(max = 128, message = "name must be at most 128 characters")
    private String name;

    @Size(max = 32, message = "role must be at most 32 characters")
    private String role;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
