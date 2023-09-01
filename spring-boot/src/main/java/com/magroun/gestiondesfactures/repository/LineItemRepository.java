package com.magroun.gestiondesfactures.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.magroun.gestiondesfactures.model.LineItem;

@Repository
public interface LineItemRepository extends JpaRepository<LineItem, Long> {
 
}

