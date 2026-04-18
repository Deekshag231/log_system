package com.logmonitor.service;

import java.time.ZoneOffset;
import java.util.Locale;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.logmonitor.dto.LogEntryRequest;
import com.logmonitor.dto.LogIngestResponse;
import com.logmonitor.dto.LogKafkaMessage;
import com.logmonitor.model.LogRecord;
import com.logmonitor.repository.LogRecordRepository;

@Service
public class LogIngestionService {

    private final TempLogStore tempLogStore;
    private final KafkaLogProducerService kafkaLogProducerService;
    private final LogRecordRepository logRecordRepository;

    public LogIngestionService(
            TempLogStore tempLogStore,
            KafkaLogProducerService kafkaLogProducerService,
            LogRecordRepository logRecordRepository) {
        this.tempLogStore = tempLogStore;
        this.kafkaLogProducerService = kafkaLogProducerService;
        this.logRecordRepository = logRecordRepository;
    }

    public LogIngestResponse ingest(LogEntryRequest request) {
        UUID eventId = request.getEventId() != null ? request.getEventId() : UUID.randomUUID();
        String level = request.getLevel().toUpperCase(Locale.ROOT);

        tempLogStore.add(request, eventId);

        LogRecord record = new LogRecord();
        record.setEventId(eventId.toString());
        record.setTimestamp(request.getTimestamp().atZone(ZoneOffset.UTC).toInstant());
        record.setLevel(level);
        record.setServiceName(request.getService());
        record.setMessage(request.getMessage());
        logRecordRepository.save(record);

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
