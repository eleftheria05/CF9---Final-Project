package gr.aueb.cf.nail_salon_booking.service;

import gr.aueb.cf.nail_salon_booking.dto.request.RegisterRequestDTO;
import gr.aueb.cf.nail_salon_booking.dto.response.AuthResponseDTO;
import gr.aueb.cf.nail_salon_booking.exception.DuplicateResourceException;
import gr.aueb.cf.nail_salon_booking.model.Customer;
import gr.aueb.cf.nail_salon_booking.model.Role;
import gr.aueb.cf.nail_salon_booking.model.User;
import gr.aueb.cf.nail_salon_booking.repository.CustomerRepository;
import gr.aueb.cf.nail_salon_booking.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, CustomerRepository customerRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public AuthResponseDTO register(RegisterRequestDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Email already in use: " + dto.getEmail());
        }

        User user = new User();
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(Role.CUSTOMER);
        User savedUser = userRepository.save(user);

        Customer customer = new Customer();
        customer.setFirstName(dto.getFirstName());
        customer.setLastName(dto.getLastName());
        customer.setEmail(dto.getEmail());
        customer.setPhoneNumber(dto.getPhoneNumber());
        customer.setUser(savedUser);
        customerRepository.save(customer);

        return new AuthResponseDTO(null, savedUser.getEmail(), savedUser.getRole().name());
    }
}