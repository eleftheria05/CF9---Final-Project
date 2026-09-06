package gr.aueb.cf.nail_salon_booking.service;

import gr.aueb.cf.nail_salon_booking.dto.request.EmployeeRequestDTO;
import gr.aueb.cf.nail_salon_booking.dto.response.EmployeeResponseDTO;
import gr.aueb.cf.nail_salon_booking.exception.DuplicateResourceException;
import gr.aueb.cf.nail_salon_booking.exception.OperationNotAllowedException;
import gr.aueb.cf.nail_salon_booking.exception.ResourceNotFoundException;
import gr.aueb.cf.nail_salon_booking.mapper.EmployeeMapper;
import gr.aueb.cf.nail_salon_booking.model.Employee;
import gr.aueb.cf.nail_salon_booking.model.Salon;
import gr.aueb.cf.nail_salon_booking.repository.EmployeeRepository;
import gr.aueb.cf.nail_salon_booking.repository.SalonRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final EmployeeMapper mapper;
    private final SalonRepository salonRepository;


    public EmployeeService(EmployeeRepository employeeRepository, EmployeeMapper mapper, SalonRepository salonRepository) {
        this.employeeRepository = employeeRepository;
        this.mapper = mapper;
        this.salonRepository = salonRepository;
    }

    public List<EmployeeResponseDTO> getAllEmployees() {
        return employeeRepository.findByIsActiveTrue()
                .stream()
                .map(mapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public EmployeeResponseDTO getEmployeeById(Long id) {
        Employee entity = findEntityById(id);
        return mapper.toResponseDTO(entity);
    }

    public EmployeeResponseDTO createEmployee(EmployeeRequestDTO dto) {
        if (employeeRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Email already in use: " + dto.getEmail());
        }
        Salon salon = salonRepository.findById(dto.getSalonId())
                .orElseThrow(() -> new ResourceNotFoundException("Salon not found with id: " + dto.getSalonId()));

        Employee entity = mapper.toEntity(dto);
        entity.setSalon(salon);

        Employee saved = employeeRepository.save(entity);
        return mapper.toResponseDTO(saved);
    }

    public EmployeeResponseDTO updateEmployee(Long id, EmployeeRequestDTO dto) {
        Employee existing = findEntityById(id);
        if (!existing.getIsActive()) {
            throw new OperationNotAllowedException("Cannot update an inactive employee with id: " + id);
        }

        Salon salon = salonRepository.findById(dto.getSalonId())
                .orElseThrow(() -> new ResourceNotFoundException("Salon not found with id: " + dto.getSalonId()));

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

    public void deleteEmployee(Long id) {
        Employee existing = findEntityById(id);
        existing.setIsActive(false);
        employeeRepository.save(existing);
    }

    // Deactivate all employees associated with a specific salon that is now deactivated.
    public void deactivateAllBySalon(Long salonId) {
        List<Employee> employees = employeeRepository.findBySalon_Id(salonId);
        employees.forEach(e -> e.setIsActive(false));
        employeeRepository.saveAll(employees);
    }

    private Employee findEntityById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    }
}
