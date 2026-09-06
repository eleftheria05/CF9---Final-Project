package gr.aueb.cf.nail_salon_booking.mapper;

import gr.aueb.cf.nail_salon_booking.dto.request.EmployeeRequestDTO;
import gr.aueb.cf.nail_salon_booking.dto.response.EmployeeResponseDTO;
import gr.aueb.cf.nail_salon_booking.model.Employee;
import org.springframework.stereotype.Component;

@Component
public class EmployeeMapper {

    private final SalonMapper salonMapper;

    public EmployeeMapper(SalonMapper salonMapper) {
        this.salonMapper = salonMapper;
    }

    public EmployeeResponseDTO toResponseDTO(Employee entity) {
        EmployeeResponseDTO dto = new EmployeeResponseDTO();
        dto.setId(entity.getId());
        dto.setFirstName(entity.getFirstName());
        dto.setLastName(entity.getLastName());
        dto.setEmail(entity.getEmail());
        dto.setPhoneNumber(entity.getPhoneNumber());
        dto.setSpecialization(entity.getSpecialization());
        dto.setHireDate(entity.getHireDate());
        dto.setIsActive(entity.getIsActive());
        dto.setSalon(salonMapper.toResponseDTO(entity.getSalon()));
        return dto;
    }

    public Employee toEntity(EmployeeRequestDTO dto) {
        Employee entity = new Employee();
        entity.setFirstName(dto.getFirstName());
        entity.setLastName(dto.getLastName());
        entity.setEmail(dto.getEmail());
        entity.setPhoneNumber(dto.getPhoneNumber());
        entity.setSpecialization(dto.getSpecialization());
        entity.setHireDate(dto.getHireDate());
        entity.setIsActive(true);
        return entity;
    }
}