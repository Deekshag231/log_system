package com.logmonitor.dto;

import java.time.Instant;

public class UserAccountResponse {

    private String id;
    private String username;
    private String email;
    private String name;
    private String role;
    private Instant createdAt;

    public static UserAccountResponse from(com.logmonitor.security.UserAccount userAccount) {
        UserAccountResponse response = new UserAccountResponse();
        response.setId(userAccount.getId());
        response.setUsername(userAccount.getUsername());
        response.setEmail(userAccount.getEmail());
        response.setName(userAccount.getName());
        response.setRole(userAccount.getRole());
        response.setCreatedAt(userAccount.getCreatedAt());
        return response;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}