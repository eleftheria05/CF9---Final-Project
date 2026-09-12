package gr.aueb.cf.nail_salon_booking.service;

import gr.aueb.cf.nail_salon_booking.dto.request.EmployeeRequestDTO;
import gr.aueb.cf.nail_salon_booking.dto.request.EmployeeUpdateDTO;
import gr.aueb.cf.nail_salon_booking.dto.response.EmployeeResponseDTO;
import gr.aueb.cf.nail_salon_booking.exception.DuplicateResourceException;
import gr.aueb.cf.nail_salon_booking.exception.OperationNotAllowedException;
import gr.aueb.cf.nail_salon_booking.exception.ResourceNotFoundException;
import gr.aueb.cf.nail_salon_booking.mapper.EmployeeMapper;
import gr.aueb.cf.nail_salon_booking.model.Employee;
import gr.aueb.cf.nail_salon_booking.model.Role;
import gr.aueb.cf.nail_salon_booking.model.Salon;
import gr.aueb.cf.nail_salon_booking.model.User;
import gr.aueb.cf.nail_salon_booking.repository.EmployeeRepository;
import gr.aueb.cf.nail_salon_booking.repository.SalonRepository;
import gr.aueb.cf.nail_salon_booking.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final EmployeeMapper mapper;
    private final SalonRepository salonRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AppointmentService appointmentService;


    public EmployeeService(EmployeeRepository employeeRepository, EmployeeMapper mapper,
                           SalonRepository salonRepository, UserRepository userRepository, PasswordEncoder passwordEncoder, AppointmentService appointmentService) {
        this.employeeRepository = employeeRepository;
        this.mapper = mapper;
        this.salonRepository = salonRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.appointmentService = appointmentService;
    }

    public List<EmployeeResponseDTO> getAllEmployees() {
        return employeeRepository.findByIsActiveTrue()
                .stream()
                .map(mapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<EmployeeResponseDTO> getAllEmployeesIncludingInactive() {
        return employeeRepository.findAll()
                .stream()
                .map(mapper::toResponseDTO)
                .toList();
    }

    public EmployeeResponseDTO getEmployeeById(Long id) {
        Employee entity = findEntityById(id);
        return mapper.toResponseDTO(entity);
    }

    public EmployeeResponseDTO createEmployee(EmployeeRequestDTO dto) {
        if (employeeRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Email already in use: " + dto.getEmail());
        }
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Email already in use: " + dto.getEmail());
        }

        Salon salon = salonRepository.findById(dto.getSalonId())
                .orElseThrow(() -> new ResourceNotFoundException("Salon not found with id: " + dto.getSalonId()));

        User user = new User();
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(Role.EMPLOYEE);
        User savedUser = userRepository.save(user);

        Employee entity = mapper.toEntity(dto);
        entity.setSalon(salon);
        entity.setUser(savedUser);

        Employee saved = employeeRepository.save(entity);
        return mapper.toResponseDTO(saved);
    }

    @Transactional
    public EmployeeResponseDTO updateEmployee(Long id, EmployeeUpdateDTO dto) {
        Employee existing = findEntityById(id);
        if (!existing.getIsActive()) {
            throw new OperationNotAllowedException("Cannot update an inactive employee with id: " + id);
        }

        Salon salon = salonRepository.findById(dto.getSalonId())
                .orElseThrow(() -> new ResourceNotFoundException("Salon not found with id: " + dto.getSalonId()));

        if (!existing.getEmail().equals(dto.getEmail())) {
            if (employeeRepository.existsByEmail(dto.getEmail()) || userRepository.existsByEmail(dto.getEmail())) {
                throw new DuplicateResourceException("Email already in use: " + dto.getEmail());
            }
            User user = existing.getUser();
            user.setEmail(dto.getEmail());
            userRepository.save(user);
        }

        existing.setFirstName(dto.getFirstName());
        existing.setLastName(dto.getLastName());
        existing.setEmail(dto.getEmail());
        existing.setPhoneNumber(dto.getPhoneNumber());
        existing.setSpecialization(dto.getSpecialization());
        existing.setHireDate(dto.getHireDate());
        existing.setSalon(salon);

        Employee updated = employeeRepository.save(existing);
        return mapper.toResponseDTO(updated);
    }

    public EmployeeResponseDTO getCurrentEmployee() {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Employee employee = employeeRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found"));
        return mapper.toResponseDTO(employee);
    }

    @Transactional
    public void deleteEmployee(Long id) {
        Employee existing = findEntityById(id);
        existing.setIsActive(false);
        employeeRepository.save(existing);
        appointmentService.cancelActiveAppointmentsByEmployee(id);
    }

    // Deactivate all employees associated with a specific salon that is now deactivated.
    @Transactional
    public void deactivateAllBySalon(Long salonId) {
        List<Employee> employees = employeeRepository.findBySalon_Id(salonId);
        employees.forEach(e -> {
            e.setIsActive(false);
            appointmentService.cancelActiveAppointmentsByEmployee(e.getId());
        });
        employeeRepository.saveAll(employees);
    }

    public EmployeeResponseDTO reactivateEmployee(Long id) {
        Employee employee = findEntityById(id);
        employee.setIsActive(true);
        Employee saved = employeeRepository.save(employee);
        return mapper.toResponseDTO(saved);
    }

    private Employee findEntityById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    }
}
