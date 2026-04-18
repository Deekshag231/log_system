package com.logmonitor.security;

import java.time.Instant;
import java.util.Locale;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AppUserDetailsService implements UserDetailsService {

    private static final Set<String> ALLOWED_ROLES = Set.of("student", "instructor");

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public AppUserDetailsService(
            UserAccountRepository userAccountRepository,
            @Value("${security.auth.username:admin}") String configuredUsername,
            @Value("${security.auth.password:admin123}") String configuredPassword,
            PasswordEncoder passwordEncoder) {
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;

        if (userAccountRepository.findByUsername(configuredUsername).isEmpty()) {
            String configuredEmail = configuredUsername.contains("@")
                    ? configuredUsername
                    : configuredUsername + "@example.com";
            userAccountRepository.save(new UserAccount(
                    configuredUsername,
                    configuredEmail,
                    configuredUsername,
                    passwordEncoder.encode(configuredPassword),
                    "instructor",
                    Instant.now()));
        }
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserAccount account = userAccountRepository.findByUsernameOrEmail(username, username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return User.withUsername(account.getUsername())
                .password(account.getPassword())
                .roles(account.getRole() != null ? account.getRole() : "USER")
                .build();
    }

    public void register(String username, String email, String name, String password, String role) {
        String resolvedEmail = (email == null || email.isBlank())
            ? (username + "@example.com")
            : email;
        String resolvedName = (name == null || name.isBlank()) ? username : name;
        String resolvedRole = normalizeRole(role);

        if (userAccountRepository.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userAccountRepository.findByEmail(resolvedEmail).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        userAccountRepository.save(new UserAccount(
                username,
                resolvedEmail,
                resolvedName,
                passwordEncoder.encode(password),
                resolvedRole,
                Instant.now()));
    }

    private String normalizeRole(String role) {
        if (role == null || role.isBlank()) {
            return "student";
        }
        String value = role.trim().toLowerCase(Locale.ROOT);
        if ("admin".equals(value)) {
            return "instructor";
        }
        if ("user".equals(value)) {
            return "student";
        }
        if (ALLOWED_ROLES.contains(value)) {
            return value;
        }
        throw new IllegalArgumentException("Role must be one of: student, instructor");
    }
}

