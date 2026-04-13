package com.logmonitor.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "logmonitor")
public class LogMonitorProperties {

    private final Kafka kafka = new Kafka();
    private final Dedup dedup = new Dedup();
    private final TempStore tempStore = new TempStore();

    public Kafka getKafka() {
        return kafka;
    }

    public Dedup getDedup() {
        return dedup;
    }

    public TempStore getTempStore() {
        return tempStore;
    }

    public static class Kafka {
        private final Topic topic = new Topic();

        public Topic getTopic() {
            return topic;
        }

        public static class Topic {
            private String logs = "logs.raw";

            public String getLogs() {
                return logs;
            }

            public void setLogs(String logs) {
                this.logs = logs;
            }
        }
    }

    public static class Dedup {
        private int ttlHours = 24;
        private long maxEntries = 500_000L;

        public int getTtlHours() {
            return ttlHours;
        }

        public void setTtlHours(int ttlHours) {
            this.ttlHours = ttlHours;
        }

        public long getMaxEntries() {
            return maxEntries;
        }

        public void setMaxEntries(long maxEntries) {
            this.maxEntries = maxEntries;
        }
    }

    public static class TempStore {
        private int maxEntries = 2000;

        public int getMaxEntries() {
            return maxEntries;
        }

        public void setMaxEntries(int maxEntries) {
            this.maxEntries = maxEntries;
        }
    }
}
