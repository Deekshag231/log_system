package com.logmonitor.service;

import com.logmonitor.dto.LogKafkaMessage;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

@Component
public class LogKafkaConsumer {

    private static final Logger log = LoggerFactory.getLogger(LogKafkaConsumer.class);

    private final ErrorAlertDeduper errorAlertDeduper;
    private final ElasticsearchLogService elasticsearchLogService;
    private final AlertService alertService;

    public LogKafkaConsumer(
            ErrorAlertDeduper errorAlertDeduper,
            ElasticsearchLogService elasticsearchLogService,
            AlertService alertService) {
        this.errorAlertDeduper = errorAlertDeduper;
        this.elasticsearchLogService = elasticsearchLogService;
        this.alertService = alertService;
    }

    @KafkaListener(
            topics = "${logmonitor.kafka.topic.logs}",
            groupId = "${spring.kafka.consumer.group-id}",
            containerFactory = "kafkaListenerContainerFactory")
    public void consume(ConsumerRecord<String, LogKafkaMessage> record, Acknowledgment acknowledgment) {
        LogKafkaMessage msg = record.value();
        try {
            elasticsearchLogService.index(msg);

            if ("ERROR".equalsIgnoreCase(msg.getLevel())
                    && errorAlertDeduper.shouldCountErrorTowardAlert(msg.getEventId())) {
                alertService.onErrorLog(AlertService.instantFromLocal(msg.getTimestamp()));
            }

            acknowledgment.acknowledge();
        } catch (Exception e) {
            log.error("Processing failed for eventId={} offset={}: {}", msg != null ? msg.getEventId() : null,
                    record.offset(), e.getMessage(), e);
            throw e;
        }
    }
}
