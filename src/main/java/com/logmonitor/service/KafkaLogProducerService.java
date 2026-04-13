package com.logmonitor.service;

import com.logmonitor.config.LogMonitorProperties;
import com.logmonitor.dto.LogKafkaMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
public class KafkaLogProducerService {

    private static final Logger log = LoggerFactory.getLogger(KafkaLogProducerService.class);

    private final KafkaTemplate<String, LogKafkaMessage> kafkaTemplate;
    private final LogMonitorProperties logMonitorProperties;

    public KafkaLogProducerService(
            KafkaTemplate<String, LogKafkaMessage> kafkaTemplate,
            LogMonitorProperties logMonitorProperties) {
        this.kafkaTemplate = kafkaTemplate;
        this.logMonitorProperties = logMonitorProperties;
    }

    public void send(LogKafkaMessage message) {
        String topic = logMonitorProperties.getKafka().getTopic().getLogs();
        String key = message.getEventId() != null ? message.getEventId().toString() : "na";
        CompletableFuture<SendResult<String, LogKafkaMessage>> future =
                kafkaTemplate.send(topic, key, message);
        future.whenComplete((result, ex) -> {
            if (ex != null) {
                log.error("Failed to publish log eventId={} to topic={}: {}", message.getEventId(), topic, ex.getMessage());
            } else {
                log.debug("Published eventId={} partition={} offset={}",
                        message.getEventId(),
                        result.getRecordMetadata().partition(),
                        result.getRecordMetadata().offset());
            }
        });
    }
}
