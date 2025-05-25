package com.spring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.entities.Reservation;
import com.spring.repository.ReservationRepository;

@Service
public class ReservationService {
	 @Autowired
	    private ReservationRepository reservationRepository;

	    public Reservation saveReservation(Reservation reservation) {
	        return reservationRepository.save(reservation);
	    }
}
