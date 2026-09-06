package gr.aueb.cf.nail_salon_booking.repository;

import gr.aueb.cf.nail_salon_booking.model.ServiceOffering;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceOfferingRepository extends JpaRepository<ServiceOffering, Long> {
    // Το JpaRepository μας δίνει ΔΩΡΕΑΝ: save(), findById(), findAll(), deleteById(), κλπ.
    // Δεν χρειάζεται να γράψουμε τίποτα άλλο προς το παρόν.
}