package com.logmonitor.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Incoming log payload from REST clients.
 */
public class LogEntryRequest {

    @NotNull(message = "timestamp is required")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;

    @NotBlank(message = "level is required")
    @Pattern(regexp = "ERROR|WARN|INFO|DEBUG", flags = Pattern.Flag.CASE_INSENSITIVE, message = "level must be ERROR, WARN, INFO, or DEBUG")
    private String level;

    @NotBlank(message = "service is required")
    @Size(max = 128)
    private String service;

    @NotBlank(message = "message is required")
    @Size(max = 8192)
    private String message;

    /**
     * Optional idempotency key; if omitted, the server generates one when publishing to Kafka.
     */
    private UUID eventId;

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public UUID getEventId() {
        return eventId;
    }

    public void setEventId(UUID eventId) {
        this.eventId = eventId;
    }
}
