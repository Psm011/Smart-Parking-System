function bookSlot(slotId, slotNumber, slotStatus) {
    // ✅ Get user details from session (HTML hidden elements)
    let userName = document.getElementById("userFullName")?.textContent.trim() || "Unknown User"; 
    let userEmail = document.getElementById("userEmailSession")?.textContent.trim() || "No Email";
    let userMobile = document.getElementById("userMobileSession")?.textContent.trim() || "N/A"; // Default fallback
    
    console.log("Booking Slot:", slotNumber, "Status:", slotStatus);

    // ✅ Prepare request data for the backend
    let paymentData = {
        slotId: slotId,
        slotNumber: slotNumber,
        amount: 100,  // Example amount, replace with actual price logic
        userEmail: userEmail
    };

    // ✅ Make a POST request to reserve the slot
    fetch("http://localhost:8080/api/reservations/reserve", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(paymentData)
    })
    .then(response => {
        if (response.status === 409) { 
            // ❌ Slot already booked
            return response.json().then(error => {
                alert(error.message); 
                throw new Error("Slot already booked!");
            });
        }
        return response.json();
    })
    .then(data => {
        console.log("Reservation Successful:", data);
        
        // ✅ Set values in modal
        document.getElementById("userName").value = userName;
        document.getElementById("userEmail").value = userEmail;
        document.getElementById("userMobile").value = userMobile;
        document.getElementById("slotNumber").value = slotNumber;
        document.getElementById("slotStatus").value = slotStatus;

        // ✅ Show the Booking Modal after successful response
        $("#bookSlotModal").modal("show");
    })
    .catch(error => {
        console.error("Error booking slot:", error);
    });
}

// ✅ Show payment modal when form is submitted
document.getElementById("bookingSlotForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    // ✅ Hide the Book Slot Modal
    $("#bookSlotModal").modal("hide");

    // ✅ Display the Payment Modal
    $("#paymentModal").modal("show");
});


function paymentstart() { 
    const paymentAmount = document.getElementById("paymentAmount").value;
    const slotNumber = document.getElementById("slotNumber").value;

    const paymentData = {
        amount: paymentAmount,
        slotNumber: slotNumber
    };

    fetch("http://localhost:8080/api/reservations/reserve", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(paymentData)
    })
    .then(response => {
        if (response.status === 409) { 
            // ❌ Slot is already booked
            return response.json().then(error => {
                alert(error.message); 
                throw new Error("Slot already booked!");
            });
        }
        return response.json();
    })
    .then(order => {
        console.log("✅ Order Created:", order);
        if (order.status === "created") {
            let options = {
                key: "rzp_test_WFfGJYJ7Lji01u",
                amount: order.amount,
                currency: "INR",
                name: "Smart Parking System",
                description: "Book Parking Slot",
                order_id: order.id,
                handler: function (response) {
					updatePaymentOnServer(response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature, order.amount);
					alert('✅ Payment successful!');
                }
            };

            let rzp = new Razorpay(options);
            rzp.open();
        }
    })
    .catch(error => console.error("❌ Error:", error));
}

function updatePaymentOnServer(paymentId, orderId, signature, amount) {
    const userName = document.getElementById("userName").value;
    const userEmail = document.getElementById("userEmail").value;
    const userMobile = document.getElementById("userMobile").value;
    const slotNumber = document.getElementById("slotNumber").value;
	const duration = document.getElementById("Duration").value;
	const reservationDateTime = document.getElementById("reservationDateTime").value;
	const vehicleNumber = document.getElementById("VehicleNumber").value;
	const vehicleType = document.getElementById("VehicleType").value;
	const model = document.getElementById("model").value;
    const paymentDetails = {
        paymentId: paymentId,
        orderId: orderId,
        signature: signature,
        name: userName,
        email: userEmail,
        mobileNumber: userMobile,
        slotNumber: slotNumber,
        amount: amount,
		duration: duration,
		reservationDateTime:reservationDateTime,
		vehicleNumber: vehicleNumber,
		vehicleType: vehicleType,
		model: model
    };

    fetch("http://localhost:8080/api/reservations/update-payment-status", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(paymentDetails)
    })
    .then(response => {
        if (response.status === 409) {
            throw new Error("Slot is already booked! Please select another slot.");
        }
        return response.json();
    })
    .then(data => {
        console.log("✅ Payment status updated successfully:", data);
        updateSlotStatusOnClient(slotNumber, "Booked");
        alert("✅ Payment success! Your slot is reserved.");
        setTimeout(() => {
            window.location.href = "/user-dashboard";
        }, 1000);
    })
    .catch(error => {
        console.error("❌ Error updating payment status:", error);
        alert(error.message);
    });
}


/**
 * Update the status of a slot in the Available Parking Slots table.
 * @param {string|number} bookedSlotNumber - The slot number that was booked.
 * @param {string} newStatus - The new status (e.g., "Booked").
 */
function updateSlotStatusOnClient(bookedSlotNumber, newStatus) {
  console.log("Attempting to update slot:", bookedSlotNumber, "to", newStatus);
  
  // Get all rows in the slots table body.
  const tableRows = document.querySelectorAll("#slotsTable tbody tr");
  let slotFound = false;

  tableRows.forEach(row => {
    // Debug: log the content of the row
    console.log("Row content:", row.innerText);
    
    // Assume the first cell contains the slot number.
    const slotCell = row.querySelector("td:first-child");
    if (slotCell) {
      // Trim and compare values (as strings)
      const cellValue = slotCell.textContent.trim();
      if (cellValue === bookedSlotNumber.toString()) {
        slotFound = true;
        // Update the Status cell (assuming it is the second cell)
        const statusCell = row.querySelector("td:nth-child(2)");
        if (statusCell) {
          statusCell.textContent = newStatus;
          console.log("Slot", bookedSlotNumber, "status updated to", newStatus);
        } else {
          console.warn("No status cell found in row for slot:", bookedSlotNumber);
        }
        
        // Optionally update the Action cell to disable further booking
        const actionCell = row.querySelector("td:nth-child(3)");
        if (actionCell) {
          actionCell.innerHTML = `<span class="text-muted">N/A</span>`;
        }
      }
    }
  });
  
  if (!slotFound) {
    console.warn("Slot number", bookedSlotNumber, "not found in the table.");
  }
}

function fetchUserBookings() {
    fetch(`/api/reservations/user/reservations`)
        .then(response => {
            if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);
            return response.json();
        })
        .then(data => {
            if (data.reservations.length > 0) {
                const receiptSlotList = document.getElementById("receiptSlot");
                const receiptAmount = document.getElementById("receiptAmount");
                const receiptStatus = document.getElementById("receiptStatus");
                const receiptName = document.getElementById("receiptName");
                const receiptEmail = document.getElementById("receiptEmail");
                const receiptMobile = document.getElementById("receiptMobile");
                const receiptDateTime = document.getElementById("receiptDateTime");
                const receiptDuration = document.getElementById("receiptDuration");
                const receiptVehicleNo = document.getElementById("vehicleNo");
                const receiptVehicleName = document.getElementById("vehicleName");

                // Clear previous data
                receiptSlotList.innerHTML = "";

                // Use the first booking to display general details
                const booking = data.reservations[0];

                // Set user details
                receiptName.textContent = data.name;
                receiptEmail.textContent = data.email;
                receiptMobile.textContent = data.mobileNo;

                receiptDateTime.textContent = booking.dateTime || 'N/A';
                receiptDuration.textContent = booking.duration || 'N/A';
                receiptVehicleNo.textContent = booking.vehicleNumber || 'N/A';
                receiptVehicleName.textContent = booking.model || 'N/A';
                receiptStatus.textContent = booking.status || 'N/A';

                // Add all slot numbers and calculate total
                let totalAmount = 0;
                data.reservations.forEach(res => {
                    let slotItem = document.createElement("li");
                    slotItem.textContent = `Slot Number: ${res.slotNumber}`;
                    receiptSlotList.appendChild(slotItem);
                    totalAmount += parseInt(res.amount);
                });

                receiptAmount.textContent = `₹${totalAmount}`;

                // Show receipt modal
                $("#receiptModal").modal("show");
            } else {
                alert("No bookings found!");
            }
        })
        .catch(error => alert(error.message));
}

function downloadReceipt() {
	const receiptContent = `
	    <html>
	    <head><title>Parking Receipt</title></head>
	    <body>
	        <h2>Parking Reservation Receipt</h2>
	        <p><strong>Name:</strong> ${document.getElementById("receiptName").textContent}</p>
	        <p><strong>Email:</strong> ${document.getElementById("receiptEmail").textContent}</p>
	        <p><strong>Mobile No:</strong> ${document.getElementById("receiptMobile").textContent}</p>
	        <p><strong>Slot Number:</strong> ${document.getElementById("receiptSlot").textContent}</p>
	        <p><strong>Date & Time:</strong> ${document.getElementById("receiptDateTime").textContent}</p>
	        <p><strong>Duration:</strong> ${document.getElementById("receiptDuration").textContent}</p>
	        <p><strong>Vehicle Number:</strong> ${document.getElementById("vehicleNo").textContent}</p>
	        <p><strong>Vehicle Name:</strong> ${document.getElementById("vehicleName").textContent}</p>
	        <p><strong>Amount:</strong> ₹${document.getElementById("receiptAmount").textContent}</p>
	        <p><strong>Status:</strong> ${document.getElementById("receiptStatus").textContent}</p>
	    </body>
	    </html>
	`;

    const blob = new Blob([receiptContent], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Parking_Receipt.html";
    link.click();
}
