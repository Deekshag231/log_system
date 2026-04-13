package com.logmonitor.model;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

public class AlertRecord {

    private final UUID id;
    private final Instant triggeredAt;
    private final String severity;
    private final String title;
    private final String detail;
    private final boolean active;

    public AlertRecord(UUID id, Instant triggeredAt, String severity, String title, String detail, boolean active) {
        this.id = id;
        this.triggeredAt = triggeredAt;
        this.severity = severity;
        this.title = title;
        this.detail = detail;
        this.active = active;
    }

    public UUID getId() {
        return id;
    }

    public Instant getTriggeredAt() {
        return triggeredAt;
    }

    public String getSeverity() {
        return severity;
    }

    public String getTitle() {
        return title;
    }

    public String getDetail() {
        return detail;
    }

    public boolean isActive() {
        return active;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        AlertRecord that = (AlertRecord) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
