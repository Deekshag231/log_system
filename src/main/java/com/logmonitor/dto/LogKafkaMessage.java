package com.logmonitor.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Payload written to Kafka and consumed by the processing pipeline.
 */
public class LogKafkaMessage {

    private UUID eventId;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;

    private String level;
    private String service;
    private String message;

    public LogKafkaMessage() {
    }

    public LogKafkaMessage(UUID eventId, LocalDateTime timestamp, String level, String service, String message) {
        this.eventId = eventId;
        this.timestamp = timestamp;
        this.level = level;
        this.service = service;
        this.message = message;
    }

    public UUID getEventId() {
        return eventId;
    }

    public void setEventId(UUID eventId) {
        this.eventId = eventId;
    }

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
}
