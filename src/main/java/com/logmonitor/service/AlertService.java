package com.logmonitor.service;

import com.logmonitor.model.AlertRecord;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Service
public class AlertService {

    private final SlidingWindowErrorTracker tracker;
    private final AlertNotificationService notificationService;
    private final ConcurrentMap<UUID, AlertRecord> activeById = new ConcurrentHashMap<>();

    public AlertService(SlidingWindowErrorTracker tracker, AlertNotificationService notificationService) {
        this.tracker = tracker;
        this.notificationService = notificationService;
    }

    /**
     * Called for each processed ERROR log (after Kafka consumption). May create an alert when the sliding window threshold is crossed.
     */
    public void onErrorLog(Instant eventTime) {
        Optional<String> detail = tracker.recordError(eventTime);
        detail.ifPresent(d -> {
            AlertRecord alert = new AlertRecord(
                    UUID.randomUUID(),
                    Instant.now(),
                    "CRITICAL",
                    "High ERROR log rate",
                    d,
                    true);
            activeById.put(alert.getId(), alert);
            notificationService.notifyChannels(alert);
        });
    }

    public List<AlertRecord> listActiveAlerts() {
        return new ArrayList<>(activeById.values());
    }

    public void clearAlertsForTest() {
        activeById.clear();
    }

    public static Instant instantFromLocal(java.time.LocalDateTime ldt) {
        return ldt.atZone(ZoneOffset.UTC).toInstant();
    }
}
