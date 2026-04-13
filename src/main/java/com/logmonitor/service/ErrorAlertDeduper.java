package com.logmonitor.service;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.logmonitor.config.LogMonitorProperties;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.UUID;

/**
 * Ensures each {@code eventId} contributes at most once to ERROR-based alerting (Kafka may redeliver).
 * Log documents use the same {@code eventId} as Elasticsearch {@code _id} for idempotent indexing.
 */
@Component
public class ErrorAlertDeduper {

    private final Cache<String, Boolean> seen;

    public ErrorAlertDeduper(LogMonitorProperties properties) {
        var dedup = properties.getDedup();
        this.seen = Caffeine.newBuilder()
                .expireAfterWrite(Duration.ofHours(dedup.getTtlHours()))
                .maximumSize(dedup.getMaxEntries())
                .build();
    }

    /**
     * @return true if this ERROR should increment the alert sliding window (first time we see this id).
     */
    public boolean shouldCountErrorTowardAlert(UUID eventId) {
        if (eventId == null) {
            return true;
        }
        return seen.asMap().putIfAbsent(eventId.toString(), Boolean.TRUE) == null;
    }
}
