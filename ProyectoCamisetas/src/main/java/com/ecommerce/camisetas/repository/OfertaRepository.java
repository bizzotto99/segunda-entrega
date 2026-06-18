package com.ecommerce.camisetas.repository;

import com.ecommerce.camisetas.model.entity.Oferta;
import com.ecommerce.camisetas.model.entity.Subasta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OfertaRepository extends JpaRepository<Oferta, Long> {

    // Obtener el historial de ofertas de una subasta ordenada por fecha de más reciente a más antigua.
    List<Oferta> findBySubastaOrderByFechaOfertaDesc(Subasta subasta);

    // Obtener la oferta más alta para determinar el ganador. Desempata por fecha más temprana.
    Optional<Oferta> findTopBySubastaOrderByMontoDescFechaOfertaAsc(Subasta subasta);

    // Contar cuántas ofertas tiene una subasta.
    int countBySubasta(Subasta subasta);
}
