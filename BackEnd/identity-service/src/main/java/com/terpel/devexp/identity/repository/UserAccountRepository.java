package com.terpel.devexp.identity.repository;

import com.terpel.devexp.identity.domain.UserAccount;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAccountRepository extends JpaRepository<UserAccount, UUID> {
    Optional<UserAccount> findByAlias(String alias);

    Optional<UserAccount> findByEmail(String email);

    boolean existsByAlias(String alias);

    boolean existsByEmail(String email);
}
