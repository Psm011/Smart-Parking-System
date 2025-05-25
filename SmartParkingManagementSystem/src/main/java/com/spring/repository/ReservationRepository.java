package com.spring.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.spring.entities.Reservation;
import com.spring.entities.User;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserEmail(String userEmail);

    @Query("SELECT r FROM Reservation r JOIN FETCH r.user u")
    List<Reservation> findAllReservationsWithUserDetails();

    Reservation findByReservationId(String reservationId); // ✅ Fixed method parameter name
    Reservation findBySlotNumberAndStatus(String slotNumber, String status);
    List<Reservation> findByUserAndStatus(User user, String status);
    List<Reservation>findByStatus(String status);
    long countByStatus(String status);
}
