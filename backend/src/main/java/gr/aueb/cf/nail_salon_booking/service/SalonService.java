package gr.aueb.cf.nail_salon_booking.service;

import gr.aueb.cf.nail_salon_booking.dto.request.SalonRequestDTO;
import gr.aueb.cf.nail_salon_booking.dto.response.SalonResponseDTO;
import gr.aueb.cf.nail_salon_booking.exception.DuplicateResourceException;
import gr.aueb.cf.nail_salon_booking.exception.OperationNotAllowedException;
import gr.aueb.cf.nail_salon_booking.exception.ResourceNotFoundException;
import gr.aueb.cf.nail_salon_booking.mapper.SalonMapper;
import gr.aueb.cf.nail_salon_booking.model.Salon;
import gr.aueb.cf.nail_salon_booking.repository.SalonRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SalonService {

    private final SalonRepository salonRepository;
    private final SalonMapper salonMapper;
    private final EmployeeService employeeService;

    public SalonService(SalonRepository salonRepository, SalonMapper salonMapper, EmployeeService employeeService) {
        this.salonRepository = salonRepository;
        this.salonMapper = salonMapper;
        this.employeeService = employeeService;
    }

    public List<SalonResponseDTO> getAllSalons() {
        return salonRepository.findByIsActiveTrue()
                .stream()
                .map(salonMapper::toResponseDTO)
                .toList();
    }

    public List<SalonResponseDTO> getAllSalonsIncludingInactive() {
        return salonRepository.findAll()
                .stream()
                .map(salonMapper::toResponseDTO)
                .toList();
    }

    public SalonResponseDTO getSalonById(Long id) {
        Salon entity = findEntityById(id);
        return salonMapper.toResponseDTO(entity);
    }

    public SalonResponseDTO createSalon(SalonRequestDTO dto) {
        if (salonRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Salon with email " + dto.getEmail() + " already exists.");
        }
        var salonEntity = salonMapper.toEntity(dto);
        var savedSalon = salonRepository.save(salonEntity);
        return salonMapper.toResponseDTO(savedSalon);
    }

    public SalonResponseDTO updateSalon(Long id, SalonRequestDTO dto) {
        Salon existingSalon = findEntityById(id);

        if (!existingSalon.getIsActive()) {
            throw new OperationNotAllowedException("Cannot update an inactive salon with id: " + id);
        }

        existingSalon.setName(dto.getName());
        existingSalon.setAddress(dto.getAddress());
        existingSalon.setPhoneNumber(dto.getPhoneNumber());
        existingSalon.setEmail(dto.getEmail());

        Salon updatedSalon = salonRepository.save(existingSalon);
        return salonMapper.toResponseDTO(updatedSalon);
    }

    //Deactivate a salon and also deactivate all employees associated with that salon.
    @Transactional
    public void deleteSalon(Long id) {
        Salon existing = findEntityById(id);
        existing.setIsActive(false);
        salonRepository.save(existing);
        employeeService.deactivateAllBySalon(id);
    }

    public SalonResponseDTO reactivateSalon(Long id) {
        Salon salon = findEntityById(id);
        salon.setIsActive(true);
        Salon saved = salonRepository.save(salon);
        return salonMapper.toResponseDTO(saved);
    }

    private Salon findEntityById(Long id) {
        return salonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Salon not found with id: " + id));
    }
}
