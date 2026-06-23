package com.ecommerce.camisetas.repository;

import com.ecommerce.camisetas.model.entity.CamisetaSubasta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CamisetaSubastaRepository extends JpaRepository<CamisetaSubasta, Long> {
}
