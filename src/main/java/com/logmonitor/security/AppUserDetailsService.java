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

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public AppUserDetailsService(
            UserAccountRepository userAccountRepository,
            @Value("${security.auth.username:admin}") String configuredUsername,
            @Value("${security.auth.password:admin123}") String configuredPassword,
            PasswordEncoder passwordEncoder) {
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;

        if (!userAccountRepository.existsById(configuredUsername)) {
            userAccountRepository.save(new UserAccount(
                    configuredUsername,
                    passwordEncoder.encode(configuredPassword)));
        }
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserAccount account = userAccountRepository.findById(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return User.withUsername(account.getUsername())
                .password(account.getPassword())
                .roles("ADMIN")
                .build();
    }

    public void register(String username, String password) {
        if (userAccountRepository.existsById(username)) {
            throw new IllegalArgumentException("Username already exists");
        }
        userAccountRepository.save(new UserAccount(username, passwordEncoder.encode(password)));
    }
}

