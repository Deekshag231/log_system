package com.logmonitor.controller;

import com.logmonitor.document.LogDocument;
import com.logmonitor.service.ElasticsearchLogService;
import com.logmonitor.service.TempLogStore;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/v1/logs")
public class LogSearchController {

    private final ElasticsearchLogService elasticsearchLogService;
    private final TempLogStore tempLogStore;

    public LogSearchController(ElasticsearchLogService elasticsearchLogService, TempLogStore tempLogStore) {
        this.elasticsearchLogService = elasticsearchLogService;
        this.tempLogStore = tempLogStore;
    }

    @GetMapping("/search/level")
    public List<LogDocument> byLevel(
            @RequestParam String level,
            @RequestParam(defaultValue = "50") int size) {
        return elasticsearchLogService.searchByLevel(level, size);
    }

    @GetMapping("/search/service")
    public List<LogDocument> byService(
            @RequestParam String name,
            @RequestParam(defaultValue = "50") int size) {
        return elasticsearchLogService.searchByService(name, size);
    }

    @GetMapping("/search/range")
    public List<LogDocument> byRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to,
            @RequestParam(defaultValue = "100") int size) {
        return elasticsearchLogService.searchByTimeRange(from, to, size);
    }

    @GetMapping("/search/message")
    public List<LogDocument> byMessage(
            @RequestParam String q,
            @RequestParam(defaultValue = "50") int size) {
        return elasticsearchLogService.fullTextSearch(q, size);
    }

    @GetMapping("/recent")
    public List<TempLogStore.Stored> recent(@RequestParam(defaultValue = "50") int limit) {
        return tempLogStore.recent(limit);
    }
}
