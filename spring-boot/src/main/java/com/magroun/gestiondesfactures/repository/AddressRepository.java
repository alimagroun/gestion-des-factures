package com.magroun.gestiondesfactures.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.magroun.gestiondesfactures.model.Address;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
}
