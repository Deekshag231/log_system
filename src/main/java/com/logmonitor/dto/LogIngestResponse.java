package com.logmonitor.dto;

import java.util.UUID;

public class LogIngestResponse {

    private String status;
    private String detail;
    private UUID eventId;
    private boolean forwardedToStream;

    public static LogIngestResponse accepted(UUID eventId, boolean forwardedToStream) {
        LogIngestResponse r = new LogIngestResponse();
        r.setStatus("accepted");
        r.setEventId(eventId);
        r.setForwardedToStream(forwardedToStream);
        r.setDetail(forwardedToStream
                ? "Log validated and published to Kafka"
                : "Log accepted; only ERROR and WARN are published to the stream");
        return r;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDetail() {
        return detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }

    public UUID getEventId() {
        return eventId;
    }

    public void setEventId(UUID eventId) {
        this.eventId = eventId;
    }

    public boolean isForwardedToStream() {
        return forwardedToStream;
    }

    public void setForwardedToStream(boolean forwardedToStream) {
        this.forwardedToStream = forwardedToStream;
    }
}
