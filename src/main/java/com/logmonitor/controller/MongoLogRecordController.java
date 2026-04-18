package com.logmonitor.controller;

import com.logmonitor.model.LogRecord;
import com.logmonitor.repository.LogRecordRepository;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/mongo/log-records")
public class MongoLogRecordController {

    private final LogRecordRepository logRecordRepository;

    public MongoLogRecordController(LogRecordRepository logRecordRepository) {
        this.logRecordRepository = logRecordRepository;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<LogRecord>> listAll() {
        return ResponseEntity.ok(logRecordRepository.findAll());
    }

    @GetMapping(value = "/by-level", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<LogRecord>> byLevel(@RequestParam String level) {
        return ResponseEntity.ok(logRecordRepository.findByLevel(level));
    }

    @GetMapping(value = "/by-service", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<LogRecord>> byService(@RequestParam String serviceName) {
        return ResponseEntity.ok(logRecordRepository.findByServiceName(serviceName));
    }
}