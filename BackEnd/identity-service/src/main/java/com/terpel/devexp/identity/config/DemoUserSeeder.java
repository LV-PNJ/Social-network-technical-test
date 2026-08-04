package com.terpel.devexp.identity.config;

import com.terpel.devexp.identity.domain.UserAccount;
import com.terpel.devexp.identity.repository.UserAccountRepository;
import java.time.LocalDate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DemoUserSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DemoUserSeeder.class);

    private final UserAccountRepository users;
    private final PasswordEncoder passwordEncoder;

    public DemoUserSeeder(UserAccountRepository users, PasswordEncoder passwordEncoder) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (users.existsByAlias("demo")) {
            return;
        }
        UserAccount demo = new UserAccount();
        demo.setAlias("demo");
        demo.setEmail("demo@devexp.local");
        demo.setPasswordHash(passwordEncoder.encode("Demo123!"));
        demo.setFirstName("Demo");
        demo.setLastName("Usuario");
        demo.setBirthDate(LocalDate.of(1995, 1, 15));
        users.save(demo);
        log.info("Seeded demo user alias=demo password=Demo123!");
    }
}
