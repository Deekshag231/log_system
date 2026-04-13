package com.logmonitor;

import com.logmonitor.config.AlertProperties;
import com.logmonitor.config.LogMonitorProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.kafka.annotation.EnableKafka;

@SpringBootApplication
@EnableKafka
@EnableConfigurationProperties({AlertProperties.class, LogMonitorProperties.class})
public class LogMonitorApplication {

    public static void main(String[] args) {
        SpringApplication.run(LogMonitorApplication.class, args);
    }
}
