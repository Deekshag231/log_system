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
}
