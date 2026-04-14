package com.logmonitor.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AppUserDetailsService implements UserDetailsService {

    private final String configuredUsername;
    private final String configuredPassword;
    private final PasswordEncoder passwordEncoder;

    public AppUserDetailsService(
            @Value("${security.auth.username:admin}") String configuredUsername,
            @Value("${security.auth.password:admin123}") String configuredPassword,
            PasswordEncoder passwordEncoder) {
        this.configuredUsername = configuredUsername;
        this.configuredPassword = configuredPassword;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        if (!configuredUsername.equals(username)) {
            throw new UsernameNotFoundException("User not found");
        }
        return User.withUsername(configuredUsername)
                .password(passwordEncoder.encode(configuredPassword))
                .roles("ADMIN")
                .build();
    }
}

