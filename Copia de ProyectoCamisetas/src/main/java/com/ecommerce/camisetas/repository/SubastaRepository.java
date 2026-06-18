package com.ecommerce.camisetas.repository;

import com.ecommerce.camisetas.model.entity.Subasta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubastaRepository extends JpaRepository<Subasta, Long> {
}
