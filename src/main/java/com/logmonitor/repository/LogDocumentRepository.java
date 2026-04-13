package com.logmonitor.repository;

import com.logmonitor.document.LogDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface LogDocumentRepository extends ElasticsearchRepository<LogDocument, String> {
}
