package gr.aueb.cf.nail_salon_booking.dto.response;

import gr.aueb.cf.nail_salon_booking.model.AppointmentStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentResponseDTO {

    private Long id;
    private CustomerResponseDTO customer;
    private EmployeeResponseDTO employee;
    private ServiceOfferingResponseDTO service;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private AppointmentStatus status;
}
