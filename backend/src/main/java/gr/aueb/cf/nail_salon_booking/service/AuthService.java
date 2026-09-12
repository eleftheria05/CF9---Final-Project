package gr.aueb.cf.nail_salon_booking.service;

import gr.aueb.cf.nail_salon_booking.dto.request.ChangePasswordRequestDTO;
import gr.aueb.cf.nail_salon_booking.dto.request.LoginRequestDTO;
import gr.aueb.cf.nail_salon_booking.dto.request.RegisterRequestDTO;
import gr.aueb.cf.nail_salon_booking.dto.response.AuthResponseDTO;
import gr.aueb.cf.nail_salon_booking.exception.BadCredentialsException;
import gr.aueb.cf.nail_salon_booking.exception.DuplicateResourceException;
import gr.aueb.cf.nail_salon_booking.exception.OperationNotAllowedException;
import gr.aueb.cf.nail_salon_booking.exception.ResourceNotFoundException;
import gr.aueb.cf.nail_salon_booking.model.Customer;
import gr.aueb.cf.nail_salon_booking.model.Employee;
import gr.aueb.cf.nail_salon_booking.model.Role;
import gr.aueb.cf.nail_salon_booking.model.User;
import gr.aueb.cf.nail_salon_booking.repository.CustomerRepository;
import gr.aueb.cf.nail_salon_booking.repository.EmployeeRepository;
import gr.aueb.cf.nail_salon_booking.repository.UserRepository;
import gr.aueb.cf.nail_salon_booking.security.JwtService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmployeeRepository employeeRepository;

    public AuthService(UserRepository userRepository, CustomerRepository customerRepository,
                       PasswordEncoder passwordEncoder, JwtService jwtService, EmployeeRepository employeeRepository) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.employeeRepository = employeeRepository;
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

        String token = jwtService.generateToken(savedUser.getEmail());
        return new AuthResponseDTO(token, savedUser.getEmail(), savedUser.getRole().name());
    }

    public AuthResponseDTO login(LoginRequestDTO dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        if (user.getRole() == Role.EMPLOYEE) {
            Employee employee = employeeRepository.findByEmail(user.getEmail())
                    .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));
            if (!employee.getIsActive()) {
                throw new OperationNotAllowedException("This employee account has been deactivated. Contact an administrator.");
            }
        }

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponseDTO(token, user.getEmail(), user.getRole().name());
    }

    public void changePassword(ChangePasswordRequestDTO dto) {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
            throw new BadCredentialsException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);
    }
}