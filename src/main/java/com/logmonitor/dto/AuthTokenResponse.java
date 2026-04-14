package com.logmonitor.dto;

public class AuthTokenResponse {

    private String tokenType;
    private String accessToken;
    private long expiresInSeconds;

    public static AuthTokenResponse bearer(String accessToken, long expiresInSeconds) {
        AuthTokenResponse response = new AuthTokenResponse();
        response.setTokenType("Bearer");
        response.setAccessToken(accessToken);
        response.setExpiresInSeconds(expiresInSeconds);
        return response;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public long getExpiresInSeconds() {
        return expiresInSeconds;
    }

    public void setExpiresInSeconds(long expiresInSeconds) {
        this.expiresInSeconds = expiresInSeconds;
    }
}

