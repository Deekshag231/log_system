package com.logmonitor.service;

import com.logmonitor.model.AlertRecord;
import com.logmonitor.repository.WarningRecordRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;

class AlertServiceTest {

    private CapturingNotificationService notificationService;
    private AlertService alertService;
    private WarningRecordRepository warningRecordRepository;

    @BeforeEach
    void setUp() {
        notificationService = new CapturingNotificationService();
        warningRecordRepository = mock(WarningRecordRepository.class);
        SlidingWindowErrorTracker tracker = new SlidingWindowErrorTracker(3, Duration.ofSeconds(60));
        alertService = new AlertService(tracker, notificationService, warningRecordRepository);
    }

    @Test
    void noAlertWhenErrorsBelowThreshold() {
        Instant t = Instant.parse("2026-04-12T10:00:00Z");
        alertService.onErrorLog(t);
        alertService.onErrorLog(t.plusMillis(1));

        assertThat(notificationService.getSent()).isEmpty();
        assertThat(alertService.listActiveAlerts()).isEmpty();
    }

    @Test
    void alertTriggeredWhenThresholdExceeded() {
        Instant base = Instant.parse("2026-04-12T10:00:00Z");
        for (int i = 0; i < 2; i++) {
            alertService.onErrorLog(base.plusMillis(i));
        }
        assertThat(notificationService.getSent()).isEmpty();

        alertService.onErrorLog(base.plusMillis(2));

        assertThat(notificationService.getSent()).hasSize(1);
        assertThat(notificationService.getSent().get(0).getTitle()).isEqualTo("High ERROR log rate");
        assertThat(alertService.listActiveAlerts()).hasSize(1);
    }

    private static final class CapturingNotificationService extends AlertNotificationService {

        private final List<AlertRecord> sent = new ArrayList<>();

        @Override
        public void notifyChannels(AlertRecord alert) {
            sent.add(alert);
        }

        List<AlertRecord> getSent() {
            return sent;
        }
    }
}
