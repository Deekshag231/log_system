package com.logmonitor.controller;

import com.logmonitor.model.ForgotPasswordRecord;
import com.logmonitor.model.ResetPasswordRecord;
import com.logmonitor.repository.ForgotPasswordRecordRepository;
import com.logmonitor.repository.ResetPasswordRecordRepository;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/mongo")
public class MongoPasswordRecordController {

    private final ForgotPasswordRecordRepository forgotPasswordRecordRepository;
    private final ResetPasswordRecordRepository resetPasswordRecordRepository;

    public MongoPasswordRecordController(
            ForgotPasswordRecordRepository forgotPasswordRecordRepository,
            ResetPasswordRecordRepository resetPasswordRecordRepository) {
        this.forgotPasswordRecordRepository = forgotPasswordRecordRepository;
        this.resetPasswordRecordRepository = resetPasswordRecordRepository;
    }

    @GetMapping(value = "/forgot-password-records", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ForgotPasswordRecord>> listForgotPasswordRecords() {
        return ResponseEntity.ok(forgotPasswordRecordRepository.findAll());
    }

    @GetMapping(value = "/reset-password-records", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ResetPasswordRecord>> listResetPasswordRecords() {
        return ResponseEntity.ok(resetPasswordRecordRepository.findAll());
    }
}