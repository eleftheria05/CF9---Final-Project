package gr.aueb.cf.nail_salon_booking.service;

import gr.aueb.cf.nail_salon_booking.dto.request.ServiceOfferingRequestDTO;
import gr.aueb.cf.nail_salon_booking.dto.response.ServiceOfferingResponseDTO;
import gr.aueb.cf.nail_salon_booking.exception.ResourceNotFoundException;
import gr.aueb.cf.nail_salon_booking.mapper.ServiceOfferingMapper;
import gr.aueb.cf.nail_salon_booking.model.ServiceOffering;
import gr.aueb.cf.nail_salon_booking.repository.ServiceOfferingRepository;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServiceOfferingService {

    private final ServiceOfferingRepository serviceOfferingRepository;
    private final ServiceOfferingMapper mapper;

    public ServiceOfferingService(ServiceOfferingRepository serviceOfferingRepository, ServiceOfferingMapper mapper) {
        this.serviceOfferingRepository = serviceOfferingRepository;
        this.mapper = mapper;
    }

    public List<ServiceOfferingResponseDTO> getAllServices() {
        return serviceOfferingRepository.findAll()
                .stream()
                .map(mapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public ServiceOfferingResponseDTO getServiceById(Long id) {
        ServiceOffering entity = findEntityById(id);
        return mapper.toResponseDTO(entity);
    }

    public ServiceOfferingResponseDTO createService(ServiceOfferingRequestDTO dto) {
        ServiceOffering entity = mapper.toEntity(dto);
        ServiceOffering saved = serviceOfferingRepository.save(entity);
        return mapper.toResponseDTO(saved);
    }

    public ServiceOfferingResponseDTO updateService(Long id, ServiceOfferingRequestDTO dto) {
        ServiceOffering existing = findEntityById(id);
        existing.setName(dto.getName());
        existing.setDescription(dto.getDescription());
        existing.setPrice(dto.getPrice());
        existing.setDurationMinutes(dto.getDurationMinutes());
        ServiceOffering updated = serviceOfferingRepository.save(existing);
        return mapper.toResponseDTO(updated);
    }

    public void deleteService(Long id) {
        serviceOfferingRepository.deleteById(id);
    }

    // private μέθοδος - επιστρέφει το Entity
    private ServiceOffering findEntityById(Long id) {
        return serviceOfferingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));
    }
}