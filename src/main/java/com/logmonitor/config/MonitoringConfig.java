package com.logmonitor.config;

import com.logmonitor.service.SlidingWindowErrorTracker;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
public class MonitoringConfig {

    @Bean
    public SlidingWindowErrorTracker slidingWindowErrorTracker(AlertProperties alertProperties) {
        return new SlidingWindowErrorTracker(
                alertProperties.getErrorThresholdPerMinute(),
                Duration.ofSeconds(alertProperties.getSlidingWindowSeconds()));
    }
}
