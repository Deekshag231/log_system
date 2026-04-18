package com.logmonitor.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.logmonitor.model.WarningRecord;

public interface WarningRecordRepository extends MongoRepository<WarningRecord, String> {

    List<WarningRecord> findBySeverity(String severity);
}