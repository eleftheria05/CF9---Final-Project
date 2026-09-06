package gr.aueb.cf.nail_salon_booking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SalonResponseDTO {

    private Long id;
    private String name;
    private String address;
    private String phoneNumber;
    private String email;
    private Boolean isActive;
}
