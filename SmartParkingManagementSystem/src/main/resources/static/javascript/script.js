
document.addEventListener("DOMContentLoaded", function () {
    const hero = document.querySelector(".hero");
    const bgImage = '/images/car1.png';

    // Load the image in the background
    const img = new Image();
    img.src = bgImage;
    img.onload = function () {
        hero.style.backgroundImage = `url('${bgImage}')`;
        hero.style.transition = "opacity 0.5s ease";
        hero.style.opacity = "1"; // Fade in after loading
    };

    // Start with invisible hero section
    hero.style.opacity = "0";
});

// Lazy Loading Images
document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll(".lazy-load");
    images.forEach((img) => {
        img.addEventListener("load", () => {
            img.classList.add("loaded");
        });

        // If image is already cached, trigger load manually
        if (img.complete) {
            img.classList.add("loaded");
        }
    });
});
// Save the scroll position when the user scrolls
window.addEventListener('scroll', function () {
    sessionStorage.setItem('scrollPosition', window.scrollY);
});

// Restore the scroll position after the page reloads
window.addEventListener('load', function () {
    const scrollPosition = sessionStorage.getItem('scrollPosition');
    if (scrollPosition) {
        window.scrollTo(0, scrollPosition);
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const userdashboardLink = document.getElementById("user-dashboard-link");
    const slotStatusSection = document.getElementById("slotStatusSection");
	const cardsection=document.getElementById("user-cards-section")
    userdashboardLink.addEventListener("click", () => {
		cardsection.style.display = "flex"; 
        slotStatusSection.style.display = "none"; 
	    });
});

//Slot Status
document.addEventListener("DOMContentLoaded", () => {
    const slotStatusLink = document.getElementById("slotStatusLink");
    const slotStatusSection = document.getElementById("slotStatusSection");
    const cardsection = document.getElementById("user-cards-section");

    let parkingSlots = []; // Store fetched parking slots
    let currentPage = 1;
    const rowsPerPage = 4;

    slotStatusLink.addEventListener("click", () => {
        loadSlotStatus();
        slotStatusSection.style.display = "block";
        cardsection.style.display = "none";
    });

    function loadSlotStatus() {
        fetch("http://localhost:8080/api/parking-slots/status")
            .then(response => response.json())
            .then(data => {
                parkingSlots = data; // Store slots globally
                currentPage = 1; // Reset to first page
                renderTable(); // Display table with pagination
            })
            .catch(error => console.error("Error fetching parking slots:", error));
    }

	function renderTable() {
	    const slotsTableBody = document.getElementById("slotsTable").getElementsByTagName("tbody")[0];
	    slotsTableBody.innerHTML = ""; // Clear table

	    const startIndex = (currentPage - 1) * rowsPerPage;
	    const endIndex = startIndex + rowsPerPage;
	    const currentSlots = parkingSlots.slice(startIndex, endIndex);

	    currentSlots.forEach(slot => {
	        const isBooked = slot.status.toLowerCase() === "paid"; // Check if slot is booked
	        const row = document.createElement("tr");
	        row.innerHTML = `
	            <td>${slot.slotNumber}</td>
	           
	            <td>
	                ${isBooked 
	                    ? `<button class="btn btn-danger" disabled>Booked</button>` 
	                    : `<button class="btn btn-primary" onclick="bookSlot(${slot.id}, '${slot.slotNumber}', '${slot.status}')">Book Slot</button>`}
	            </td>
	        `;
	        slotsTableBody.appendChild(row);
	    });

	    // Update button states
	    document.getElementById("prev-page").disabled = currentPage === 1;
	    document.getElementById("next-page").disabled = currentPage * rowsPerPage >= parkingSlots.length;
	    document.getElementById("current-page").textContent = currentPage;
	}


    // Pagination Controls
    document.getElementById("prev-page").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    document.getElementById("next-page").addEventListener("click", () => {
        if (currentPage * rowsPerPage < parkingSlots.length) {
            currentPage++;
            renderTable();
        }
    });
});



//admin dashbooard
		document.getElementById('dashboard-link').addEventListener('click', function () {
		    document.getElementById('cards-section').style.display = 'flex'; // Ensure flex display
		    document.getElementById('booking-table-section').style.display = 'none';
			document.getElementById('parking-slot-section').style.display = 'none';
			document.getElementById('user-management-section').style.display = 'none';

			

		});

// JavaScript to toggle Booking table
		        document.getElementById('booking-link').addEventListener('click', function () {
		            document.getElementById('cards-section').style.display = 'none';
		            document.getElementById('booking-table-section').style.display = 'block';
		        });

				document.getElementById('booking-link').addEventListener('click', function () {
				    document.getElementById('cards-section').style.display = 'none';
				    document.getElementById('booking-table-section').style.display = 'block';
					document.getElementById('parking-slot-section').style.display = 'none';
					document.getElementById('user-management-section').style.display = 'none';

				    fetchBookings(); // Fetch data when booking link is clicked
				});
				document.getElementById('prev-page').addEventListener('click', function () {
				    if (currentPage > 1) {
				        currentPage--;
				        renderTable();
				    }
				});

				document.getElementById('next-page').addEventListener('click', function () {
				    if (currentPage * rowsPerPage < bookings.length) {
				        currentPage++;
				        renderTable();
				    }
				});


				const rowsPerPage = 4;
				let currentPage = 1;
				let bookings = []; // Store fetched bookings
				

					//booking details
				// Fetch all reservations from the API
				async function fetchBookings() {
				  try {
				    const response = await fetch('http://localhost:8080/api/reservations/all');
				    if (!response.ok) {
				      throw new Error('Failed to fetch bookings');
				    }
				    bookings = await response.json(); // Store fetched data
				    console.log('Fetched bookings:', bookings); // Check the JSON structure in the console
				    renderTable();
				  } catch (error) {
				    console.error('Error fetching bookings:', error);
				  }
				}

				function renderTable() {
				  const tableBody = document.querySelector('#booking-table tbody');
				  tableBody.innerHTML = ''; // Clear existing rows

				  const start = (currentPage - 1) * rowsPerPage;
				  const end = start + rowsPerPage;
				  const currentBookings = bookings.slice(start, end);

				  currentBookings.forEach(booking => {
				    const fullName = booking.name || 'N/A';
				    const phoneNumber = booking.mobileNo || 'N/A';
				    const reservationId = booking.reservationId || 'N/A';
				    const slotNumber = booking.slotNumber || 'N/A';
				    const vehicleType = booking.vehicleType || 'N/A';
				    const vehicleName = booking.vehicleNumber || booking.model || 'N/A'; // Use whichever is preferred
				    const dateTime = booking.dateTime || 'N/A';
				    const duration = booking.duration || 'N/A';
				    const amount = booking.amount || 'N/A';
				    const status = booking.status || 'N/A';

				    const row = document.createElement('tr');
				    row.innerHTML = `
				      <td>${fullName}</td>
				      <td>${phoneNumber}</td>
				      <td>${reservationId}</td>
				      <td>${slotNumber}</td>
				      <td>${vehicleType}</td>
				      <td>${vehicleName}</td>
				      <td>${dateTime}</td>
				      <td>${duration}</td>
				      <td>${amount}</td>
				      <td>${status}</td>
				      <td>
				        <button class="btn btn-danger btn-sm" style="background-color:red" onclick="cancelBooking(${booking.id})">Cancel Booking</button>
				      </td>
				    `;
				    tableBody.appendChild(row);
				  });

				  document.getElementById('current-page').textContent = currentPage;

				  // Update button states
				  document.getElementById('prev-page').disabled = currentPage === 1;
				  document.getElementById('next-page').disabled = currentPage * rowsPerPage >= bookings.length;
				}

				// Cancel a booking by its ID
				async function cancelBooking(bookingId) {
				  // Confirm cancellation action with the user
				  if (!confirm("Are you sure you want to cancel this booking?")) {
				    return;
				  }

				  try {
				    // Send DELETE request to the server
				    const response = await fetch(`http://localhost:8080/api/reservations/${bookingId}`, {
				      method: 'DELETE',
				    });

				    if (!response.ok) {
				      throw new Error(`Failed to cancel booking. Status: ${response.status}`);
				    }

				    // Notify user of success
				    alert("Booking canceled successfully!");

				    // Refresh the bookings list
				    fetchBookings();
				  } catch (error) {
				    console.error("Error canceling booking:", error);
				    alert("Error canceling booking. Please try again.");
				  }
				}

				document.addEventListener('DOMContentLoaded', async () => {
				    try {
				        const response = await fetch('http://localhost:8080/api/reservations/total');
				        if (!response.ok) {
				            throw new Error('Failed to fetch total bookings');
				        }
				        const totalBookings = await response.json();
				        document.querySelector('#total-bookings').textContent = totalBookings; // Update the h2 element with total bookings
				    } catch (error) {
				        console.error('Error fetching total bookings:', error);
				        document.querySelector('#total-bookings').textContent = 'Error'; // Display error if fetching fails
				    }
				});
	
				
				document.addEventListener("DOMContentLoaded", function () {
				    fetchTotalParkingSlots();
				    fetchTotalVehicles();
				    fetchTotalVehicleOwners();
				});

				// Fetch Total Parking Slots (for the dashboard card)
				async function fetchTotalParkingSlots() {
				    try {
				        const response = await fetch("http://localhost:8080/api/parking-slots/count");
				        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

				        const totalSlots = await response.json();
				        document.querySelector(".card.green h2").textContent = totalSlots;
				    } catch (error) {
				        console.error("Error fetching total parking slots:", error);
				    }
				}

				// Fetch Total Vehicles (for Dashboard)
				async function fetchTotalVehicles() {
				    try {
				        const response = await fetch("http://localhost:8080/api/users-management/total-vehicles");
				        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

				        const totalVehicles = await response.json();
				        document.querySelector(".card.bluecolor h2").textContent = totalVehicles;
				    } catch (error) {
				        console.error("Error fetching total vehicles:", error);
				    }
				}

				// Fetch Total Vehicle Owners (for Dashboard)
				async function fetchTotalVehicleOwners() {
				    try {
				        const response = await fetch("http://localhost:8080/api/users-management/total-vehicle-owners");
				        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

				        const totalVehicleOwners = await response.json();
				        document.querySelector(".card.teal h2").textContent = totalVehicleOwners;
				    } catch (error) {
				        console.error("Error fetching total vehicle owners:", error);
				    }
				}
			
