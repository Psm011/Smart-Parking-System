package com.spring.controller;

import com.spring.dto.ReservationDTO;
import com.spring.entities.ParkingSlot;
import com.spring.entities.Reservation;
import com.spring.entities.User;
import com.spring.exception.ResourceNotFoundException;
import com.spring.repository.ReservationRepository;
import com.spring.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;
import jakarta.servlet.http.HttpSession;
import netscape.javascript.JSObject;

import com.razorpay.*;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:8080")
public class ReservationController {

	@Autowired
	private UserRepository userRepository;
	@Autowired
	private ReservationRepository reservationRepository;

	@PostMapping("/reserve")
	@ResponseBody
	public ResponseEntity<Map<String, Object>> CreateOrder(@RequestBody Map<String, Object> data, HttpSession session)
	        throws RazorpayException {
	    System.out.println(data);

	    String slotNumber = data.get("slotNumber").toString();
	    String userEmail = (String) session.getAttribute("userEmail");

	    // ✅ Check if slot is already booked
	    Reservation existingReservation = reservationRepository.findBySlotNumberAndStatus(slotNumber, "paid");
	    if (existingReservation != null) {
	        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "This slot is already booked!"));
	    }

	    int amt = Integer.parseInt(data.get("amount").toString());
	    RazorpayClient client = new RazorpayClient("rzp_test_WFfGJYJ7Lji01u", "DZ5cKDT5W44boUk8V2Fi83MY");

	    JSONObject obj = new JSONObject();
	    obj.put("amount", amt * 100);
	    obj.put("currency", "INR");
	    obj.put("receipt", "txn_" + UUID.randomUUID());

	    Order order = client.orders.create(obj);

	    // 🔁 Only return the order info — don't save yet
	    Map<String, Object> response = new HashMap<>();
	    response.put("id", order.get("id"));
	    response.put("amount", order.get("amount"));
	    response.put("currency", order.get("currency"));
	    response.put("status", order.get("status"));

	    return ResponseEntity.ok(response);
	}

	@PostMapping("/update-payment-status")
	@ResponseBody
	public ResponseEntity<Map<String, Object>> updatePaymentStatus(@RequestBody Map<String, Object> data, HttpSession session) {
	    System.out.println("Updating Payment Status: " + data);

	    String orderId = (String) data.get("orderId");
	    String paymentId = (String) data.get("paymentId");
	    String slotNumber = (String) data.get("slotNumber");
	    int amount = Integer.parseInt(data.get("amount").toString());
	    int duration = Integer.parseInt(data.get("duration").toString());
	    String reservationDateTimeStr = (String) data.get("reservationDateTime");
	    LocalDateTime dateTime = LocalDateTime.parse(reservationDateTimeStr);

	    String vehicleNumber = (String) data.get("vehicleNumber");
	    String vehicleType = (String) data.get("vehicleType");
	    String model = (String) data.get("model");
	    String userEmail = (String) session.getAttribute("userEmail");
	    User user = userRepository.findByEmail(userEmail);
	    System.out.println("Amount received: " + data.get("amount"));

	    amount=amount/100;
	 // ✅ Save the reservation now
	    Reservation reservation = new Reservation();
	    reservation.setUser(user);
	    reservation.setReservationId(orderId);
	    reservation.setPaymentId(paymentId);
	    reservation.setAmount(String.valueOf(amount));
	    reservation.setStatus("paid");
	    reservation.setSlotNumber(slotNumber);
	    reservation.setReceipt("txn_" + UUID.randomUUID()); // Fixed camel case
	    reservation.setDuration(duration);
	    reservation.setDateTime(dateTime);
	    reservation.setVehicleNumber(vehicleNumber);
	    reservation.setVehicleType(vehicleType);
	    reservation.setModel(model);
	    reservationRepository.save(reservation);


	    return ResponseEntity.ok(Map.of(
	        "message", "Reservation saved and payment status updated",
	        "status", "paid"
	    ));
	}


	private String generatePaymentId() {
		// Generate a unique paymentId, e.g., using a UUID or timestamp
		return "PAY-" + System.currentTimeMillis();
	}

    // After payment is successful, confirm the reservation
    @PutMapping("/confirmPayment/{reservationId}")
   public Reservation confirmPayment(@PathVariable Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + reservationId));

       // Update the status to confirmed and save the reservation
       reservation.setStatus("confirmed");
       return reservationRepository.save(reservation);
    }
//user receipt
    @GetMapping("/user/reservations")
    public ResponseEntity<Map<String, Object>> getUserReceipt(HttpSession session) {
        String userEmail = (String) session.getAttribute("userEmail");

        if (userEmail == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                 .body(Map.of("message", "User not logged in"));
        }

        // 🔍 Find user by email
        User user = userRepository.findByEmail(userEmail);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(Map.of("message", "User not found"));
        }

        // 🔍 Get all 'paid' reservations for the user
        List<Reservation> reservations = reservationRepository.findByUserAndStatus(user, "paid");

        if (reservations.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(Map.of("message", "No paid bookings found"));
        }

        // 📦 Response payload
        Map<String, Object> response = new HashMap<>();
        response.put("reservations", reservations); // All bookings
        response.put("name", user.getFullName());
        response.put("email", user.getEmail());
        response.put("mobileNo", user.getPhoneNumber());
        response.put("totalAmount", reservations.stream()
                .mapToInt(res -> Integer.parseInt(res.getAmount()))
                .sum());


        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public List<Map<String, Object>> getAllReservations() {
        List<Reservation> reservations = reservationRepository.findByStatus("paid");

        return reservations.stream().map(res -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", res.getId());
            map.put("reservationId", res.getReservationId());
            map.put("amount", res.getAmount());
            map.put("status", res.getStatus());
            map.put("paymentId", res.getPaymentId());
            map.put("slotNumber", res.getSlotNumber());
            map.put("duration", res.getDuration());
            map.put("dateTime", res.getDateTime());
            map.put("vehicleNumber", res.getVehicleNumber());
            map.put("vehicleType", res.getVehicleType());
            map.put("model", res.getModel());

            // Add user info
            User user = res.getUser();
            map.put("name", user.getFullName()); // Full name
            map.put("email", user.getEmail());
            map.put("mobileNo", user.getPhoneNumber());

            return map;
        }).collect(Collectors.toList());
    }

	@GetMapping("/total")
	public ResponseEntity<Long> getTotalBookings() {
	    long totalPaidBookings = reservationRepository.countByStatus("Paid"); // Count only paid bookings
		return ResponseEntity.ok(totalPaidBookings);
	}

	// Cancel a booking
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> cancelBooking(@PathVariable Long id) {
		reservationRepository.deleteById(id);
		return ResponseEntity.noContent().build();
	}

	// Modify a booking
	@PutMapping("/{id}")
	public Reservation modifyBooking(@PathVariable Long id, @RequestBody Reservation updatedReservation) {
		Reservation reservation = reservationRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));

		reservation.setDuration(updatedReservation.getDuration());
		reservation.setSlotNumber(updatedReservation.getSlotNumber());

		return reservationRepository.save(reservation);
	}

	@GetMapping("/receipt/{id}")
	public String getReceipt(@PathVariable Long id, Model model) {
		Reservation reservation = reservationRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Reservation not found with ID: " + id));
		model.addAttribute("reservation", reservation);
		return "receipt"; // This refers to the receipt.html template
	}

}