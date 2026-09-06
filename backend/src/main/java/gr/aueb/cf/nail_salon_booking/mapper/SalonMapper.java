package gr.aueb.cf.nail_salon_booking.mapper;

import gr.aueb.cf.nail_salon_booking.dto.request.SalonRequestDTO;
import gr.aueb.cf.nail_salon_booking.dto.response.SalonResponseDTO;
import gr.aueb.cf.nail_salon_booking.model.Salon;
import org.springframework.stereotype.Component;

@Component
public class SalonMapper {

    public SalonResponseDTO toResponseDTO(Salon entity) {
        SalonResponseDTO dto = new SalonResponseDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setAddress(entity.getAddress());
        dto.setPhoneNumber(entity.getPhoneNumber());
        dto.setEmail(entity.getEmail());
        dto.setIsActive(entity.getIsActive());
        return dto;
    }

    public Salon toEntity(SalonRequestDTO dto) {
        Salon entity = new Salon();
        entity.setName(dto.getName());
        entity.setAddress(dto.getAddress());
        entity.setPhoneNumber(dto.getPhoneNumber());
        entity.setEmail(dto.getEmail());
        entity.setIsActive(true);
        return entity;
    }
}
