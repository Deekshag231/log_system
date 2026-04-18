package com.logmonitor.controller;

import com.logmonitor.dto.UserAccountResponse;
import com.logmonitor.security.UserAccount;
import com.logmonitor.security.UserAccountRepository;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/mongo/users")
public class MongoUserController {

    private final UserAccountRepository userAccountRepository;

    public MongoUserController(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<UserAccountResponse>> listUsers() {
        List<UserAccountResponse> users = userAccountRepository.findAll().stream()
                .map(UserAccountResponse::from)
                .toList();
        return ResponseEntity.ok(users);
    }
}