package gr.aueb.cf.nail_salon_booking.mapper;

import gr.aueb.cf.nail_salon_booking.dto.request.AppointmentRequestDTO;
import gr.aueb.cf.nail_salon_booking.dto.response.AppointmentResponseDTO;
import gr.aueb.cf.nail_salon_booking.model.Appointment;
import gr.aueb.cf.nail_salon_booking.model.AppointmentStatus;
import org.springframework.stereotype.Component;

@Component
public class AppointmentMapper {

    private final CustomerMapper customerMapper;
    private final EmployeeMapper employeeMapper;
    private final ServiceOfferingMapper serviceOfferingMapper;

    public AppointmentMapper(CustomerMapper customerMapper, EmployeeMapper employeeMapper, ServiceOfferingMapper serviceOfferingMapper) {
        this.customerMapper = customerMapper;
        this.employeeMapper = employeeMapper;
        this.serviceOfferingMapper = serviceOfferingMapper;
    }

    public AppointmentResponseDTO toResponseDTO(Appointment entity) {
        AppointmentResponseDTO dto = new AppointmentResponseDTO();
        dto.setId(entity.getId());
        dto.setCustomer(customerMapper.toResponseDTO(entity.getCustomer()));
        dto.setEmployee(employeeMapper.toResponseDTO(entity.getEmployee()));
        dto.setService(serviceOfferingMapper.toResponseDTO(entity.getService()));
        dto.setStartTime(entity.getStartTime());
        dto.setEndTime(entity.getEndTime());
        dto.setStatus(entity.getStatus());
        return dto;
    }

    public Appointment toEntity(AppointmentRequestDTO dto) {
        Appointment entity = new Appointment();
        entity.setStartTime(dto.getStartTime());
        entity.setStatus(AppointmentStatus.PENDING);
        return entity;
    }
}