package com.logmonitor.config;

import com.logmonitor.dto.LogKafkaMessage;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.listener.ContainerProperties;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.util.backoff.FixedBackOff;

@Configuration
public class KafkaConfig {

    @Bean
    public NewTopic logsRawTopic(LogMonitorProperties props) {
        return TopicBuilder.name(props.getKafka().getTopic().getLogs())
                .partitions(3)
                .replicas(1)
                .build();
    }

    /**
     * Manual ack + bounded retries: at-least-once delivery with backoff; idempotency handled in the listener.
     */
    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, LogKafkaMessage> kafkaListenerContainerFactory(
            ConsumerFactory<String, LogKafkaMessage> consumerFactory) {
        ConcurrentKafkaListenerContainerFactory<String, LogKafkaMessage> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory);
        factory.getContainerProperties().setAckMode(ContainerProperties.AckMode.MANUAL);
        DefaultErrorHandler errorHandler = new DefaultErrorHandler(new FixedBackOff(2000L, 5L));
        factory.setCommonErrorHandler(errorHandler);
        return factory;
    }
}
