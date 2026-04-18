package com.logmonitor.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.logmonitor.model.LogRecord;

public interface LogRecordRepository extends MongoRepository<LogRecord, String> {

    List<LogRecord> findByLevel(String level);

    List<LogRecord> findByServiceName(String serviceName);
}