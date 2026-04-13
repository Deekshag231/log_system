package com.logmonitor.service;

import com.logmonitor.dto.LogEntryRequest;
import com.logmonitor.dto.LogIngestResponse;
import com.logmonitor.dto.LogKafkaMessage;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.UUID;

@Service
public class LogIngestionService {

    private final TempLogStore tempLogStore;
    private final KafkaLogProducerService kafkaLogProducerService;

    public LogIngestionService(TempLogStore tempLogStore, KafkaLogProducerService kafkaLogProducerService) {
        this.tempLogStore = tempLogStore;
        this.kafkaLogProducerService = kafkaLogProducerService;
    }

    public LogIngestResponse ingest(LogEntryRequest request) {
        UUID eventId = request.getEventId() != null ? request.getEventId() : UUID.randomUUID();
        String level = request.getLevel().toUpperCase(Locale.ROOT);

        tempLogStore.add(request, eventId);

        boolean forward = "ERROR".equals(level) || "WARN".equals(level);
        if (forward) {
            LogKafkaMessage kafkaMessage = new LogKafkaMessage(
                    eventId,
                    request.getTimestamp(),
                    level,
                    request.getService(),
                    request.getMessage());
            kafkaLogProducerService.send(kafkaMessage);
        }

        return LogIngestResponse.accepted(eventId, forward);
    }
}
