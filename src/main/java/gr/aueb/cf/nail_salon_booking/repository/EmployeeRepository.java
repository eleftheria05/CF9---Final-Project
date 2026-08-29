package gr.aueb.cf.nail_salon_booking.repository;

import gr.aueb.cf.nail_salon_booking.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    boolean existsByEmail(String email);
    List<Employee> findByIsActiveTrue();
}
