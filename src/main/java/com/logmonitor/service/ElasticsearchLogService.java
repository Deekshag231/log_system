package com.logmonitor.service;

import com.logmonitor.document.LogDocument;
import com.logmonitor.dto.LogKafkaMessage;
import com.logmonitor.repository.LogDocumentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.Criteria;
import org.springframework.data.elasticsearch.core.query.CriteriaQuery;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ElasticsearchLogService {

    private static final Logger log = LoggerFactory.getLogger(ElasticsearchLogService.class);

    private final LogDocumentRepository repository;
    private final ElasticsearchOperations elasticsearchOperations;

    public ElasticsearchLogService(LogDocumentRepository repository, ElasticsearchOperations elasticsearchOperations) {
        this.repository = repository;
        this.elasticsearchOperations = elasticsearchOperations;
    }

    public LogDocument index(LogKafkaMessage msg) {
        LogDocument doc = new LogDocument();
        String id = msg.getEventId() != null ? msg.getEventId().toString() : UUID.randomUUID().toString();
        doc.setId(id);
        doc.setTimestamp(toInstant(msg.getTimestamp()));
        doc.setLevel(msg.getLevel().toUpperCase());
        doc.setService(msg.getService());
        doc.setMessage(msg.getMessage());
        doc.setEventId(msg.getEventId() != null ? msg.getEventId().toString() : null);
        LogDocument saved = repository.save(doc);
        log.debug("Indexed log id={} eventId={}", saved.getId(), saved.getEventId());
        return saved;
    }

    public List<LogDocument> searchByLevel(String level, int size) {
        Criteria c = new Criteria("level").is(level.toUpperCase());
        return search(new CriteriaQuery(c), size);
    }

    public List<LogDocument> searchByService(String service, int size) {
        Criteria c = new Criteria("service").is(service);
        return search(new CriteriaQuery(c), size);
    }

    public List<LogDocument> searchByTimeRange(Instant from, Instant to, int size) {
        Criteria c = new Criteria("timestamp").between(from, to);
        return search(new CriteriaQuery(c), size);
    }

    public List<LogDocument> fullTextSearch(String text, int size) {
        Criteria c = new Criteria("message").matches(text);
        return search(new CriteriaQuery(c), size);
    }

    private List<LogDocument> search(Query query, int size) {
        query.setPageable(PageRequest.of(0, Math.min(size, 500)));
        SearchHits<LogDocument> hits = elasticsearchOperations.search(query, LogDocument.class);
        return hits.getSearchHits().stream().map(SearchHit::getContent).collect(Collectors.toList());
    }

    private static Instant toInstant(LocalDateTime ldt) {
        if (ldt == null) {
            return Instant.now();
        }
        return ldt.atZone(ZoneOffset.UTC).toInstant();
    }
}
