package com.spring;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.entities.Reservation;
import com.spring.repository.ReservationRepository;

@Service
public class BookingService {

    @Autowired
    private ReservationRepository reservationRepository;

    public List<Reservation> getBookings(String userEmail) {
        return reservationRepository.findByUserEmail(userEmail);  // Replace with your actual method to fetch user bookings
    }
    public Reservation getBookings(Long bookingId) {
        return reservationRepository.findById(bookingId).orElse(null);
    }
    public void saveBooking(Reservation reservation) {
        reservationRepository.save(reservation); // repository to save the data
    }

}