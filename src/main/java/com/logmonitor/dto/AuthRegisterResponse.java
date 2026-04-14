package com.logmonitor.dto;

public class AuthRegisterResponse {

    private String username;
    private String message;

    public static AuthRegisterResponse created(String username) {
        AuthRegisterResponse response = new AuthRegisterResponse();
        response.setUsername(username);
        response.setMessage("User registered successfully");
        return response;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
