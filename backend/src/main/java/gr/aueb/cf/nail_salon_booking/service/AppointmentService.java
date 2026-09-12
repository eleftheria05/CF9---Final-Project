package gr.aueb.cf.nail_salon_booking.service;

import gr.aueb.cf.nail_salon_booking.dto.request.AppointmentRequestDTO;
import gr.aueb.cf.nail_salon_booking.dto.response.AppointmentResponseDTO;
import gr.aueb.cf.nail_salon_booking.exception.AccessDeniedException;
import gr.aueb.cf.nail_salon_booking.exception.OperationNotAllowedException;
import gr.aueb.cf.nail_salon_booking.exception.ResourceNotFoundException;
import gr.aueb.cf.nail_salon_booking.mapper.AppointmentMapper;
import gr.aueb.cf.nail_salon_booking.model.Customer;
import gr.aueb.cf.nail_salon_booking.model.Employee;
import gr.aueb.cf.nail_salon_booking.model.Appointment;
import gr.aueb.cf.nail_salon_booking.model.AppointmentStatus;
import gr.aueb.cf.nail_salon_booking.model.ServiceOffering;
import gr.aueb.cf.nail_salon_booking.repository.AppointmentRepository;
import gr.aueb.cf.nail_salon_booking.repository.CustomerRepository;
import gr.aueb.cf.nail_salon_booking.repository.EmployeeRepository;
import gr.aueb.cf.nail_salon_booking.repository.ServiceOfferingRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final AppointmentMapper appointmentMapper;
    private final CustomerRepository customerRepository;
    private final EmployeeRepository employeeRepository;
    private final ServiceOfferingRepository serviceOfferingRepository;

    public AppointmentService(AppointmentRepository appointmentRepository, AppointmentMapper appointmentMapper, CustomerRepository customerRepository, EmployeeRepository employeeRepository, ServiceOfferingRepository serviceOfferingRepository) {
        this.appointmentRepository = appointmentRepository;
        this.appointmentMapper = appointmentMapper;
        this.customerRepository = customerRepository;
        this.employeeRepository = employeeRepository;
        this.serviceOfferingRepository = serviceOfferingRepository;
    }

    //For creating an appointment, we need to ensure that the customer, employee, and service exist. We also need to calculate the end time of the appointment based on the service duration.
    public AppointmentResponseDTO createAppointment(AppointmentRequestDTO dto) {
        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + dto.getCustomerId()));

        checkOwnershipOrAdmin(customer);

        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + dto.getEmployeeId()));

        ServiceOffering service = serviceOfferingRepository.findById(dto.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + dto.getServiceId()));

        Appointment entity = appointmentMapper.toEntity(dto);
        LocalDateTime endTime = dto.getStartTime().plusMinutes(service.getDurationMinutes());

        List<Appointment> overlapping = appointmentRepository.findOverlappingAppointments(
                dto.getEmployeeId(), dto.getStartTime(), endTime);

        if (!overlapping.isEmpty()) {
            throw new OperationNotAllowedException("Employee already has an appointment during this time slot.");
        }

        entity.setCustomer(customer);
        entity.setEmployee(employee);
        entity.setService(service);
        entity.setEndTime(endTime);

        Appointment saved = appointmentRepository.save(entity);
        return appointmentMapper.toResponseDTO(saved);
    }

    public List<AppointmentResponseDTO> getAllAppointments() {
        return appointmentRepository.findAllByOrderByStartTimeAsc()
                .stream()
                .map(appointmentMapper::toResponseDTO)
                .toList();
    }

    public AppointmentResponseDTO getAppointmentById(Long id) {
        Appointment entity = findEntityById(id);
        return appointmentMapper.toResponseDTO(entity);
    }

    //Confirm only a pending appointment.
    public AppointmentResponseDTO confirmAppointment(Long id) {
        Appointment entity = findEntityById(id);
        if (entity.getStatus() != AppointmentStatus.PENDING) {
            throw new OperationNotAllowedException("Only PENDING appointments can be confirmed. Current status: " + entity.getStatus());
        }
        entity.setStatus(AppointmentStatus.CONFIRMED);
        Appointment updated = appointmentRepository.save(entity);
        return appointmentMapper.toResponseDTO(updated);
    }

    //Cancel an appointment only if it is not completed or already cancelled.
    public AppointmentResponseDTO cancelAppointment(Long id) {
        Appointment entity = findEntityById(id);
        checkOwnershipOrAdmin(entity.getCustomer());

        if (entity.getStatus() == AppointmentStatus.COMPLETED || entity.getStatus() == AppointmentStatus.CANCELLED) {
            throw new OperationNotAllowedException("Cannot cancel an appointment with status: " + entity.getStatus());
        }
        entity.setStatus(AppointmentStatus.CANCELLED);
        Appointment updated = appointmentRepository.save(entity);
        return appointmentMapper.toResponseDTO(updated);
    }

    //Complete an appointment only if it is confirmed.
    public AppointmentResponseDTO completeAppointment(Long id) {
        Appointment entity = findEntityById(id);
        if (entity.getStatus() != AppointmentStatus.CONFIRMED) {
            throw new OperationNotAllowedException("Only CONFIRMED appointments can be completed. Current status: " + entity.getStatus());
        }
        entity.setStatus(AppointmentStatus.COMPLETED);
        Appointment updated = appointmentRepository.save(entity);
        return appointmentMapper.toResponseDTO(updated);
    }

    public void cancelActiveAppointmentsByEmployee(Long employeeId) {
        List<Appointment> appointments = appointmentRepository.findByEmployee_IdAndStatusIn(
                employeeId, List.of(AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED));
        appointments.forEach(a -> a.setStatus(AppointmentStatus.CANCELLED));
        appointmentRepository.saveAll(appointments);
    }

    private void checkOwnershipOrAdmin(Customer customer) {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        boolean isAdmin = SecurityContextHolder.getContext().getAuthentication().getAuthorities()
                .stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && !customer.getEmail().equals(currentUserEmail)) {
            throw new AccessDeniedException("You are not allowed to perform this action for another customer.");
        }
    }

    private Appointment findEntityById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
    }


}
