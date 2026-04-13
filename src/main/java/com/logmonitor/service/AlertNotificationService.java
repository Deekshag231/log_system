package com.logmonitor.service;

import com.logmonitor.model.AlertRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Simulates outbound alerting (email/pager). Real deployments would plug in SMTP, PagerDuty, etc.
 */
@Service
public class AlertNotificationService {

    private static final Logger log = LoggerFactory.getLogger(AlertNotificationService.class);

    public void notifyChannels(AlertRecord alert) {
        log.warn("[ALERT] id={} severity={} title={} | {}", alert.getId(), alert.getSeverity(), alert.getTitle(), alert.getDetail());
        log.info("[EMAIL-SIMULATION] to=oncall@example.com subject=\"{}\" body=\"{}\"", alert.getTitle(), alert.getDetail());
    }
}
