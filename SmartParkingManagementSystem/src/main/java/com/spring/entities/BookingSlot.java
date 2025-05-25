package com.spring.entities;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

public class BookingSlot {
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;
	    private String slotId;
	    private String status;
	    private String type; // Two-Villar or Four-Villar
	    private String imagePath; 
		public String getImagePath() {
			return imagePath;
		}
		public void setImagePath(String imagePath) {
			this.imagePath = imagePath;
		}
		public Long getId() {
			return id;
		}
		public void setId(Long id) {
			this.id = id;
		}
		public String getSlotId() {
			return slotId;
		}
		public void setSlotId(String slotId) {
			this.slotId = slotId;
		}
		public String getStatus() {
			return status;
		}
		public void setStatus(String status) {
			this.status = status;
		}
		public String getType() {
			return type;
		}
		public void setType(String type) {
			this.type = type;
		}
		@Override
		public String toString() {
			return "BookingSlot [id=" + id + ", slotId=" + slotId + ", status=" + status + ", type=" + type + "]";
		}
	    
}
