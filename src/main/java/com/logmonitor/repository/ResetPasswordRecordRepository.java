package com.logmonitor.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.logmonitor.model.ResetPasswordRecord;

public interface ResetPasswordRecordRepository extends MongoRepository<ResetPasswordRecord, String> {

    Optional<ResetPasswordRecord> findByEmail(String email);
}