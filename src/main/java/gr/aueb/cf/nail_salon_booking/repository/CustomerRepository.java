package gr.aueb.cf.nail_salon_booking.repository;

import gr.aueb.cf.nail_salon_booking.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long>{
    boolean existsByEmail(String email);
}
