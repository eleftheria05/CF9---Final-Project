package gr.aueb.cf.nail_salon_booking.service;

import gr.aueb.cf.nail_salon_booking.dto.request.EmployeeRequestDTO;
import gr.aueb.cf.nail_salon_booking.dto.response.EmployeeResponseDTO;
import gr.aueb.cf.nail_salon_booking.exception.DuplicateResourceException;
import gr.aueb.cf.nail_salon_booking.exception.OperationNotAllowedException;
import gr.aueb.cf.nail_salon_booking.exception.ResourceNotFoundException;
import gr.aueb.cf.nail_salon_booking.mapper.EmployeeMapper;
import gr.aueb.cf.nail_salon_booking.model.Employee;
import gr.aueb.cf.nail_salon_booking.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final EmployeeMapper mapper;

    public EmployeeService(EmployeeRepository employeeRepository, EmployeeMapper mapper) {
        this.employeeRepository = employeeRepository;
        this.mapper = mapper;
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
        Employee entity = mapper.toEntity(dto);
        Employee saved = employeeRepository.save(entity);
        return mapper.toResponseDTO(saved);
    }

    public EmployeeResponseDTO updateEmployee(Long id, EmployeeRequestDTO dto) {
        Employee existing = findEntityById(id);
        if (!existing.getIsActive()) {
            throw new OperationNotAllowedException("Cannot update an inactive employee with id: " + id);
        }
        existing.setFirstName(dto.getFirstName());
        existing.setLastName(dto.getLastName());
        existing.setEmail(dto.getEmail());
        existing.setPhoneNumber(dto.getPhoneNumber());
        existing.setSpecialization(dto.getSpecialization());
        existing.setHireDate(dto.getHireDate());
        Employee updated = employeeRepository.save(existing);
        return mapper.toResponseDTO(updated);
    }

    public void deleteEmployee(Long id) {
        Employee existing = findEntityById(id);
        existing.setIsActive(false);
        employeeRepository.save(existing);
    }

    private Employee findEntityById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    }
}
