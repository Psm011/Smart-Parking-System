//package com.spring.controller;
//
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import com.spring.BookingSlotRepository;
//import com.spring.entities.BookingSlot;
//
//import jakarta.websocket.server.ServerEndpoint;
//@Service
//public class BookingSlotService {
//	 @Autowired
//	    private BookingSlotRepository bookingSlotRepository;
//
//	    public List<BookingSlot> getAllSlots() {
//	        return bookingSlotRepository.findAll();
//	    }
//
//	    public void addSlot(String type, String status) {
//	        String image = type.equals("two-villar") ? "images/two-villar.jpg" : "images/four-villar.jpg";
//	        BookingSlot slot = new BookingSlot();
//	        slot.setType(type);
//	        slot.setStatus(status);
//	        slot.setImagePath(image);
//	        bookingSlotRepository.save(slot);
//	    }
//
//	    public void updateSlot(BookingSlot slot) {
//	        bookingSlotRepository.save(slot);
//	    }
//
//	    public void deleteSlot(Long id) {
//	        bookingSlotRepository.deleteById(id);
//	    }
//}
