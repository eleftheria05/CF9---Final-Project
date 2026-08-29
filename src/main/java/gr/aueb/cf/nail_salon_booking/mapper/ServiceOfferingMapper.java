package gr.aueb.cf.nail_salon_booking.mapper;

import gr.aueb.cf.nail_salon_booking.dto.request.ServiceOfferingRequestDTO;
import gr.aueb.cf.nail_salon_booking.dto.response.ServiceOfferingResponseDTO;
import gr.aueb.cf.nail_salon_booking.model.ServiceOffering;
import org.springframework.stereotype.Component;

@Component
public class ServiceOfferingMapper {

    // Response DTO για να στείλουμε στον client
    public ServiceOfferingResponseDTO toResponseDTO(ServiceOffering entity) {
        ServiceOfferingResponseDTO dto = new ServiceOfferingResponseDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setPrice(entity.getPrice());
        dto.setDurationMinutes(entity.getDurationMinutes());
        return dto;
    }

    // Request DTO για να αποθηκεύσουμε στη βάση
    public ServiceOffering toEntity(ServiceOfferingRequestDTO dto) {
        ServiceOffering entity = new ServiceOffering();
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setPrice(dto.getPrice());
        entity.setDurationMinutes(dto.getDurationMinutes());
        return entity;
    }
}