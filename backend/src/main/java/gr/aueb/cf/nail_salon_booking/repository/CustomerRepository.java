package gr.aueb.cf.nail_salon_booking.repository;

import gr.aueb.cf.nail_salon_booking.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long>{
    boolean existsByEmail(String email);
    Optional<Customer> findByEmail(String email);
}
