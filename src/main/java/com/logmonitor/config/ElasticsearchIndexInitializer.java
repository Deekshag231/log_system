package com.logmonitor.config;

import com.logmonitor.document.LogDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.IndexOperations;
import org.springframework.stereotype.Component;

/**
 * Creates the {@code logs} index with mappings derived from {@link LogDocument} when missing.
 */
@Component
@ConditionalOnProperty(name = "logmonitor.elasticsearch.init-index", havingValue = "true", matchIfMissing = true)
public class ElasticsearchIndexInitializer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(ElasticsearchIndexInitializer.class);

    private final ElasticsearchOperations operations;

    public ElasticsearchIndexInitializer(ElasticsearchOperations operations) {
        this.operations = operations;
    }

    @Override
    public void run(ApplicationArguments args) {
        try {
            IndexOperations indexOps = operations.indexOps(LogDocument.class);
            if (!indexOps.exists()) {
                indexOps.createWithMapping();
                log.info("Created Elasticsearch index 'logs' with mapping");
            }
        } catch (Exception e) {
            log.warn("Elasticsearch index initialization deferred or failed: {}", e.getMessage());
        }
    }
}
