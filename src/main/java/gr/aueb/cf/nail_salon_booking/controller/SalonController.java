package gr.aueb.cf.nail_salon_booking.controller;

import gr.aueb.cf.nail_salon_booking.dto.request.SalonRequestDTO;
import gr.aueb.cf.nail_salon_booking.dto.response.SalonResponseDTO;
import gr.aueb.cf.nail_salon_booking.service.SalonService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salons")
public class SalonController {

    private final SalonService salonService;

    public SalonController(SalonService salonService) {
        this.salonService = salonService;
    }

    @GetMapping
    public ResponseEntity<List<SalonResponseDTO>> getAllSalons() {
        List<SalonResponseDTO> salons = salonService.getAllSalons();
        return ResponseEntity.ok(salons);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalonResponseDTO> getSalonById(@PathVariable Long id) {
        SalonResponseDTO salon = salonService.getSalonById(id);
        return ResponseEntity.ok(salon);
    }

    @PostMapping
    public ResponseEntity<SalonResponseDTO> createSalon(@Valid @RequestBody SalonRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(salonService.createSalon(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SalonResponseDTO> updateSalon(@PathVariable Long id, @Valid @RequestBody SalonRequestDTO dto) {
        return ResponseEntity.ok(salonService.updateSalon(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSalon(@PathVariable Long id) {
        salonService.deleteSalon(id);
        return ResponseEntity.noContent().build();
    }
}
