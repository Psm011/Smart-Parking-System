package com.spring.controller;

import java.util.List; 

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.entities.ParkingSlot;
import com.spring.repository.ParkingSlotRepository;

@RestController
@RequestMapping("/api/parking-slots")
@CrossOrigin(origins = "http://localhost:3000")
public class ParkingSlotController {

    @Autowired
    private ParkingSlotRepository parkingSlotRepository;

    @GetMapping
    public List<ParkingSlot> getAllSlots() {
        return parkingSlotRepository.findAll();
    }

    @PostMapping
    public ParkingSlot addParkingSlot(@RequestBody ParkingSlot parkingSlot) {
        return parkingSlotRepository.save(parkingSlot);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteParkingSlot(@PathVariable Long id) {
        if (!parkingSlotRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Slot with ID " + id + " does not exist.");
        }

        try {
            parkingSlotRepository.deleteById(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Slot deleted successfully.");
        } catch (Exception e) {
            e.printStackTrace(); // Log exception
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Unable to delete slot. It may be referenced by other entities.");
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<ParkingSlot> modifyParkingSlot(@PathVariable Long id, @RequestBody ParkingSlot parkingSlot) {
        ParkingSlot existingSlot = parkingSlotRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Invalid slot ID"));
        existingSlot.setCategory(parkingSlot.getCategory());
        existingSlot.setSection(parkingSlot.getSection());
        existingSlot.setSlotNumber(parkingSlot.getSlotNumber());
        existingSlot.setStatus(parkingSlot.getStatus());

        ParkingSlot updatedSlot = parkingSlotRepository.save(existingSlot);
        return ResponseEntity.ok(updatedSlot);
    }

    @GetMapping("/count")
    public long getParkingSlotCount() {
        return parkingSlotRepository.count();
    }
    
 // Controller for Parking Slot Status
    @GetMapping("/status")
    public List<ParkingSlot> getAvailableParkingSlots() {
        return parkingSlotRepository.findAll();
    }

    // Controller to book a parking slot
    @PostMapping("/book/{id}")
    public ResponseEntity<String> bookParkingSlot(@PathVariable Long id) {
        ParkingSlot slot = parkingSlotRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid slot ID"));

        if (slot.getStatus().equals("Available")) {
            slot.setStatus("Booked");
            parkingSlotRepository.save(slot);
            return ResponseEntity.status(HttpStatus.OK).body("Slot booked successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Slot is already booked.");
        }
    }

}
