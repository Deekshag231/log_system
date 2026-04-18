package com.logmonitor.controller;

import com.logmonitor.security.UserAccountRepository;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/mongo")
public class MongoDebugController {

    private final UserAccountRepository userAccountRepository;

    public MongoDebugController(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    @GetMapping(value = "/users/count", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> userCount() {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("collection", "users");
        body.put("count", userAccountRepository.count());
        body.put("timestamp", Instant.now());
        return ResponseEntity.ok(body);
    }
}