package com.logmonitor.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AppUserDetailsService implements UserDetailsService {

    private final Map<String, String> users = new ConcurrentHashMap<>();
    private final PasswordEncoder passwordEncoder;

    public AppUserDetailsService(
            @Value("${security.auth.username:admin}") String configuredUsername,
            @Value("${security.auth.password:admin123}") String configuredPassword,
            PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
        users.put(configuredUsername, passwordEncoder.encode(configuredPassword));
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        String encodedPassword = users.get(username);
        if (encodedPassword == null) {
            throw new UsernameNotFoundException("User not found");
        }
        return User.withUsername(username)
                .password(encodedPassword)
                .roles("ADMIN")
                .build();
    }

    public void register(String username, String password) {
        String encodedPassword = passwordEncoder.encode(password);
        String previous = users.putIfAbsent(username, encodedPassword);
        if (previous != null) {
            throw new IllegalArgumentException("Username already exists");
        }
    }
}

