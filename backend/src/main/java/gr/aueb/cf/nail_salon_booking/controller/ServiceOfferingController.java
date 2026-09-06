package gr.aueb.cf.nail_salon_booking.controller;

import gr.aueb.cf.nail_salon_booking.dto.request.ServiceOfferingRequestDTO;
import gr.aueb.cf.nail_salon_booking.dto.response.ServiceOfferingResponseDTO;
import gr.aueb.cf.nail_salon_booking.service.ServiceOfferingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceOfferingController {

    private final ServiceOfferingService serviceOfferingService;

    public ServiceOfferingController(ServiceOfferingService serviceOfferingService) {
        this.serviceOfferingService = serviceOfferingService;
    }

    @GetMapping
    public ResponseEntity<List<ServiceOfferingResponseDTO>> getAllServices() {
        return ResponseEntity.ok(serviceOfferingService.getAllServices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceOfferingResponseDTO> getServiceById(@PathVariable Long id) {
        return ResponseEntity.ok(serviceOfferingService.getServiceById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ServiceOfferingResponseDTO> createService(@Valid @RequestBody ServiceOfferingRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(serviceOfferingService.createService(dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ServiceOfferingResponseDTO> updateService(@PathVariable Long id, @Valid @RequestBody ServiceOfferingRequestDTO dto) {
        return ResponseEntity.ok(serviceOfferingService.updateService(id, dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        serviceOfferingService.deleteService(id);
        return ResponseEntity.noContent().build();
    }
}