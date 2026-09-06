package gr.aueb.cf.nail_salon_booking.mapper;

import gr.aueb.cf.nail_salon_booking.dto.request.CustomerRequestDTO;
import gr.aueb.cf.nail_salon_booking.dto.response.CustomerResponseDTO;
import gr.aueb.cf.nail_salon_booking.model.Customer;
import org.springframework.stereotype.Component;

@Component
public class CustomerMapper {

    //Response
    public CustomerResponseDTO toResponseDTO(Customer entity) {
        CustomerResponseDTO dto = new CustomerResponseDTO();
        dto.setId(entity.getId());
        dto.setFirstName(entity.getFirstName());
        dto.setLastName(entity.getLastName());
        dto.setEmail(entity.getEmail());
        dto.setPhoneNumber(entity.getPhoneNumber());
        return dto;
    }

    //Request
    public Customer toEntity(CustomerRequestDTO dto) {
        Customer entity = new Customer();
        entity.setFirstName(dto.getFirstName());
        entity.setLastName(dto.getLastName());
        entity.setEmail(dto.getEmail());
        entity.setPhoneNumber(dto.getPhoneNumber());
        return entity;
    }
}