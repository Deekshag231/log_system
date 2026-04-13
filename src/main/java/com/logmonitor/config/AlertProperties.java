package com.logmonitor.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "logmonitor.alert")
public class AlertProperties {

    /**
     * Number of ERROR logs in the sliding window before an alert fires.
     */
    private int errorThresholdPerMinute = 100;

    /**
     * Sliding window length in seconds.
     */
    private int slidingWindowSeconds = 60;

    public int getErrorThresholdPerMinute() {
        return errorThresholdPerMinute;
    }

    public void setErrorThresholdPerMinute(int errorThresholdPerMinute) {
        this.errorThresholdPerMinute = errorThresholdPerMinute;
    }

    public int getSlidingWindowSeconds() {
        return slidingWindowSeconds;
    }

    public void setSlidingWindowSeconds(int slidingWindowSeconds) {
        this.slidingWindowSeconds = slidingWindowSeconds;
    }
}
