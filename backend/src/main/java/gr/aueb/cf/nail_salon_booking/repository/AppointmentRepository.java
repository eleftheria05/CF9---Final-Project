package gr.aueb.cf.nail_salon_booking.repository;

import gr.aueb.cf.nail_salon_booking.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    @Query("SELECT a FROM Appointment a WHERE a.employee.id = :employeeId " +
            "AND a.status <> gr.aueb.cf.nail_salon_booking.model.AppointmentStatus.CANCELLED " +
            "AND a.startTime < :endTime AND a.endTime > :startTime")
    List<Appointment> findOverlappingAppointments(@Param("employeeId") Long employeeId,
                                                  @Param("startTime") LocalDateTime startTime,
                                                  @Param("endTime") LocalDateTime endTime);
    List<Appointment> findAllByOrderByStartTimeAsc();
}
