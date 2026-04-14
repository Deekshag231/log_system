package com.logmonitor.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping(value = "/", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> home() {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("service", "log-monitor");
        body.put("status", "ok");
        body.put("apiBase", "/api/v1");
        body.put("endpoints", Map.of(
                "ingest", "POST /api/v1/logs",
                "search", "GET /api/v1/logs/search/*",
                "recent", "GET /api/v1/logs/recent",
                "alerts", "GET /api/v1/alerts/active"
        ));
        body.put("kibana", "http://localhost:5601");
        return ResponseEntity.ok(body);
    }
}

