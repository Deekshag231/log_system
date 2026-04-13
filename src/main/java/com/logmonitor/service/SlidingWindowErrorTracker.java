package com.logmonitor.service;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Optional;

/**
 * Counts ERROR events in a sliding time window. Fires once when the count first reaches the threshold,
 * then resets the latch when the count drops back below the threshold (as old events expire).
 */
public class SlidingWindowErrorTracker {

    private final int threshold;
    private final Duration window;
    private final Deque<Instant> timestamps = new ArrayDeque<>();
    private boolean latched;

    public SlidingWindowErrorTracker(int threshold, Duration window) {
        if (threshold < 1) {
            throw new IllegalArgumentException("threshold must be >= 1");
        }
        this.threshold = threshold;
        this.window = window;
    }

    public synchronized Optional<String> recordError(Instant now) {
        Instant cutoff = now.minus(window);
        while (!timestamps.isEmpty() && timestamps.peekFirst().isBefore(cutoff)) {
            timestamps.pollFirst();
        }

        if (timestamps.size() < threshold) {
            latched = false;
        }

        timestamps.addLast(now);

        if (timestamps.size() >= threshold && !latched) {
            latched = true;
            return Optional.of(String.format(
                    "ERROR rate spike: %d errors in the last %ds (threshold=%d)",
                    timestamps.size(), window.toSeconds(), threshold));
        }
        return Optional.empty();
    }
}
