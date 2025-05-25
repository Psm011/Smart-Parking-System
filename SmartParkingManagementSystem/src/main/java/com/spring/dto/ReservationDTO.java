package com.spring.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class ReservationDTO {
    private Long id;
    private String parkingType;
    private String slotNumber;
    private LocalDate reserveDate;
    private LocalTime reserveTime;
    private int duration;
    private String status;
    private String paymentId;
    private String amount;
    private String userFullName;
    private String userPhoneNumber;

    // Getters and setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getParkingType() {
        return parkingType;
    }
    public void setParkingType(String parkingType) {
        this.parkingType = parkingType;
    }
    public String getSlotNumber() {
        return slotNumber;
    }
    public void setSlotNumber(String slotNumber) {
        this.slotNumber = slotNumber;
    }
    public LocalDate getReserveDate() {
        return reserveDate;
    }
    public void setReserveDate(LocalDate reserveDate) {
        this.reserveDate = reserveDate;
    }
    public LocalTime getReserveTime() {
        return reserveTime;
    }
    public void setReserveTime(LocalTime reserveTime) {
        this.reserveTime = reserveTime;
    }
    public int getDuration() {
        return duration;
    }
    public void setDuration(int duration) {
        this.duration = duration;
    }
    public String getstatus() {
        return status;
    }
    public void setStatus(String Status) {
        this.status = status;
    }
    public String getPaymentId() {
        return paymentId;
    }
    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }
    public String amount() {
        return amount;
    }
    public void setamount(String amount) {
        this.amount = amount;
    }
    public String getUserFullName() {
        return userFullName;
    }
    public void setUserFullName(String userFullName) {
        this.userFullName = userFullName;
    }
    public String getUserPhoneNumber() {
        return userPhoneNumber;
    }
    public void setUserPhoneNumber(String userPhoneNumber) {
        this.userPhoneNumber = userPhoneNumber;
    }
}
