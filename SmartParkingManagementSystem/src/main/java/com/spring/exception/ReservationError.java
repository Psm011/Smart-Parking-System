package com.spring.exception;

//Define an error response class
public class ReservationError {
 private String message;
 
 // Constructors, getters and setters
 public ReservationError(String message) {
     this.message = message;
 }

 public String getMessage() {
     return message;
 }

 public void setMessage(String message) {
     this.message = message;
 }
}