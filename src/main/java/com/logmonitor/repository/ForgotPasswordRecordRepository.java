package com.logmonitor.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.logmonitor.model.ForgotPasswordRecord;

public interface ForgotPasswordRecordRepository extends MongoRepository<ForgotPasswordRecord, String> {

    Optional<ForgotPasswordRecord> findByEmail(String email);
}