package com.logmonitor.security;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserAccountRepository extends MongoRepository<UserAccount, String> {

	Optional<UserAccount> findByUsername(String username);

	Optional<UserAccount> findByEmail(String email);

	Optional<UserAccount> findByUsernameOrEmail(String username, String email);
}
