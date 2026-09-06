package gr.aueb.cf.nail_salon_booking.controller;

import gr.aueb.cf.nail_salon_booking.dto.request.AppointmentRequestDTO;
import gr.aueb.cf.nail_salon_booking.dto.response.AppointmentResponseDTO;
import gr.aueb.cf.nail_salon_booking.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping
    public ResponseEntity<List<AppointmentResponseDTO>> getAllAppointments() {
        List<AppointmentResponseDTO> appointment = appointmentService.getAllAppointments();
        return ResponseEntity.ok(appointment);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentResponseDTO> getAppointmentById(@PathVariable Long id) {
        AppointmentResponseDTO appointment = appointmentService.getAppointmentById(id);
        return ResponseEntity.ok(appointment);
    }

    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    @PostMapping
    public ResponseEntity<AppointmentResponseDTO> createAppointment(@Valid @RequestBody AppointmentRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(appointmentService.createAppointment(dto));
    }

    @PreAuthorize("hasAnyRole('EMPLOYEE', 'ADMIN')")
    @PatchMapping("/{id}/confirm")
    public ResponseEntity<AppointmentResponseDTO> confirmAppointment(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.confirmAppointment(id));
    }

    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<AppointmentResponseDTO> cancelAppointment(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.cancelAppointment(id));
    }

    @PreAuthorize("hasAnyRole('EMPLOYEE', 'ADMIN')")
    @PatchMapping("/{id}/complete")
    public ResponseEntity<AppointmentResponseDTO> completeAppointment(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.completeAppointment(id));
    }
}
