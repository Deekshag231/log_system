package com.logmonitor.controller;

import com.logmonitor.dto.LogEntryRequest;
import com.logmonitor.dto.LogIngestResponse;
import com.logmonitor.service.LogIngestionService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/logs")
public class LogIngestionController {

    private final LogIngestionService logIngestionService;

    public LogIngestionController(LogIngestionService logIngestionService) {
        this.logIngestionService = logIngestionService;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<LogIngestResponse> ingest(@Valid @RequestBody LogEntryRequest request) {
        return ResponseEntity.ok(logIngestionService.ingest(request));
    }
}
