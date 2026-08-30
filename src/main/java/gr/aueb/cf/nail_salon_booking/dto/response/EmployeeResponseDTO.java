package gr.aueb.cf.nail_salon_booking.dto.response;

import gr.aueb.cf.nail_salon_booking.dto.response.SalonResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeResponseDTO {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String specialization;
    private LocalDate hireDate;
    private Boolean isActive;
    private SalonResponseDTO salon;
}
