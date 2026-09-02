package gr.aueb.cf.nail_salon_booking;

import gr.aueb.cf.nail_salon_booking.model.Role;
import gr.aueb.cf.nail_salon_booking.model.User;
import gr.aueb.cf.nail_salon_booking.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@nailsalon.com")) {
            User admin = new User();
            admin.setEmail("admin@nailsalon.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            System.out.println("Default admin created: admin@nailsalon.com / admin123");
        }
    }
}