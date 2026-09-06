package gr.aueb.cf.nail_salon_booking.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentRequestDTO {

    @NotNull(message = "Customer is required")
    private Long customerId;

    @NotNull(message = "Employee is required")
    private Long employeeId;

    @NotNull(message = "Service is required")
    private Long serviceId;

    @NotNull(message = "Start time of the appointment is required")
    private LocalDateTime startTime;
}
