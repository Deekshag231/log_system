package com.logmonitor.service;

import com.logmonitor.config.LogMonitorProperties;
import com.logmonitor.dto.LogEntryRequest;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

/**
 * Short-lived in-memory buffer of recently ingested logs (all levels).
 */
@Component
public class TempLogStore {

    private final int maxEntries;
    private final List<Stored> buffer = Collections.synchronizedList(new ArrayList<>());

    public TempLogStore(LogMonitorProperties properties) {
        this.maxEntries = properties.getTempStore().getMaxEntries();
    }

    public void add(LogEntryRequest request, UUID eventId) {
        synchronized (buffer) {
            buffer.add(0, new Stored(eventId, request.getTimestamp(), request.getLevel(), request.getService(), request.getMessage()));
            while (buffer.size() > maxEntries) {
                buffer.remove(buffer.size() - 1);
            }
        }
    }

    public List<Stored> recent(int limit) {
        synchronized (buffer) {
            int n = Math.min(limit, buffer.size());
            return new ArrayList<>(buffer.subList(0, n));
        }
    }

    public record Stored(UUID eventId, java.time.LocalDateTime timestamp, String level, String service, String message) {
    }
}
