package gr.aueb.cf.nail_salon_booking.service;

import gr.aueb.cf.nail_salon_booking.dto.request.CustomerRequestDTO;
import gr.aueb.cf.nail_salon_booking.dto.response.CustomerResponseDTO;
import gr.aueb.cf.nail_salon_booking.exception.AccessDeniedException;
import gr.aueb.cf.nail_salon_booking.exception.OperationNotAllowedException;
import gr.aueb.cf.nail_salon_booking.exception.ResourceNotFoundException;
import gr.aueb.cf.nail_salon_booking.mapper.CustomerMapper;
import gr.aueb.cf.nail_salon_booking.model.Customer;
import gr.aueb.cf.nail_salon_booking.repository.AppointmentRepository;
import gr.aueb.cf.nail_salon_booking.repository.CustomerRepository;
import gr.aueb.cf.nail_salon_booking.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper mapper;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public CustomerService(CustomerRepository customerRepository, CustomerMapper mapper, AppointmentRepository appointmentRepository, UserRepository userRepository) {
        this.customerRepository = customerRepository;
        this.mapper = mapper;
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
    }

    public List<CustomerResponseDTO> getAllCustomers() {
        return customerRepository.findAll()
                .stream()
                .map(mapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public CustomerResponseDTO getCustomerById(Long id) {
        Customer entity = findEntityById(id);
        checkOwnershipOrAdmin(entity);
        return mapper.toResponseDTO(entity);
    }

    /*public CustomerResponseDTO createCustomer(CustomerRequestDTO dto) {
        if (customerRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Email already in use: " + dto.getEmail());
        }
        Customer entity = mapper.toEntity(dto);
        Customer saved = customerRepository.save(entity);
        return mapper.toResponseDTO(saved);
    }*/

    public CustomerResponseDTO updateCustomer(Long id, CustomerRequestDTO dto) {
        Customer existing = findEntityById(id);
        checkOwnershipOrAdmin(existing);
        existing.setFirstName(dto.getFirstName());
        existing.setLastName(dto.getLastName());
        existing.setEmail(dto.getEmail());
        existing.setPhoneNumber(dto.getPhoneNumber());
        Customer updated = customerRepository.save(existing);
        return mapper.toResponseDTO(updated);
    }

    @Transactional
    public void deleteCustomer(Long id) {
        Customer customer = findEntityById(id);
        if (appointmentRepository.existsByCustomer_Id(id)) {
            throw new OperationNotAllowedException("Cannot delete a customer with existing appointments.");
        }
        Long userId = customer.getUser().getId();
        customerRepository.deleteById(id);
        userRepository.deleteById(userId);
    }

    public CustomerResponseDTO getCurrentCustomer() {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Customer customer = customerRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found"));
        return mapper.toResponseDTO(customer);
    }

    private Customer findEntityById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
    }

    private void checkOwnershipOrAdmin(Customer customer) {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        boolean isAdmin = SecurityContextHolder.getContext().getAuthentication().getAuthorities()
                .stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && !customer.getEmail().equals(currentUserEmail)) {
            throw new AccessDeniedException("You are not allowed to access this customer's data.");
        }
    }
}
