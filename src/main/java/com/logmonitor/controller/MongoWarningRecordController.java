package com.logmonitor.controller;

import com.logmonitor.model.WarningRecord;
import com.logmonitor.repository.WarningRecordRepository;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/mongo/warning-records")
public class MongoWarningRecordController {

    private final WarningRecordRepository warningRecordRepository;

    public MongoWarningRecordController(WarningRecordRepository warningRecordRepository) {
        this.warningRecordRepository = warningRecordRepository;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<WarningRecord>> listAll() {
        return ResponseEntity.ok(warningRecordRepository.findAll());
    }

    @GetMapping(value = "/by-severity", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<WarningRecord>> bySeverity(@RequestParam String severity) {
        return ResponseEntity.ok(warningRecordRepository.findBySeverity(severity));
    }
}