// Function to open the Add/Modify Parking Slot Modal
	function openAddSlotModal() {
	    $('#addSlotModal').modal('show');
	}
document.addEventListener("DOMContentLoaded", () => {
    // DOM elements
    const dashboardLink = document.getElementById("dashboard-link");
    const parkingSlotLink = document.getElementById("parking-slot-link");
    const parkingSlotSection = document.getElementById("parking-slot-section");
    const cardsSection = document.getElementById("cards-section");
    const bookingTableSection = document.getElementById("booking-table-section");
    const usermanage = document.getElementById("user-management-section");
	const parkingSlotTable = document.getElementById("parkingSlotTable").getElementsByTagName("tbody")[0];
    const addSlotBtn = document.getElementById("addSlotBtn");
    const addSlotModal = document.getElementById("addSlotModal");
    const closeModal = document.querySelector(".modal .close");
    const addSlotForm = document.getElementById("addSlotForm");
	const parkinglink = document.getElementById("parking-link");
	
    let currentSlotId = null; // For tracking slot to be modified
    let parkingSlots = []; // Array to store parking slots fetched from the server
    let currentPage = 1; // Current page
    const rowsPerPage = 4; // Number of rows per page

    // Show Dashboard Content
    dashboardLink.addEventListener("click", () => {
        if (cardsSection) {
            cardsSection.style.display = "flex"; 
            cardsSection.style.flexWrap = "wrap"; 
            cardsSection.style.gap = "20px"; 
        }
        if (parkingSlotSection) parkingSlotSection.style.display = "none";
        if (bookingTableSection) bookingTableSection.style.display = "none";
    });

    // Show Parking Slot Section
    parkingSlotLink.addEventListener("click", () => {
        parkingSlotSection.style.display = "block";
        if (cardsSection) cardsSection.style.display = "none";
        if (bookingTableSection) bookingTableSection.style.display = "none";
        if (usermanage) usermanage.style.display = "none";

        fetchParkingSlots(); 
    });

    async function fetchParkingSlots() {
	    try {
	        const response = await fetch("http://localhost:8080/api/parking-slots");
	        if (!response.ok) throw new Error(`Error: ${response.status}`);
	        parkingSlots = await response.json(); // Store fetched slots
	        renderTable(); 
	    } catch (error) {
	        console.error("Error fetching parking slots:", error);
	        alert("Unable to load parking slots.");
	    }
	}

	// Fix the field names inside renderTable function
	function renderTable() {
	    parkingSlotTable.innerHTML = ""; 

	    const startIndex = (currentPage - 1) * rowsPerPage;
	    const endIndex = startIndex + rowsPerPage;
	    const currentSlots = parkingSlots.slice(startIndex, endIndex);

	    currentSlots.forEach((slot) => {
	        const newRow = parkingSlotTable.insertRow();
			newRow.innerHTML = `
			    <td>${slot.category}</td>  
			    <td>${slot.section}</td>    
			    <td>${slot.slotNumber}</td>
			    <td>${slot.status}</td>
			    <td class="del-modify">
			        <button class="delete-btn" style="background-color: red;" data-id="${slot.id}">Delete</button>
			        <button class="modify-btn" 
			            data-id="${slot.id}" 
			            data-slotcategory="${slot.category}" 
			            data-slotSection="${slot.section}" 
			            data-slotNumber="${slot.slotNumber}" 
			            data-status="${slot.status}">
			            Modify
			        </button>
			    </td>
			`;

	    });

	    document.getElementById("prev-slot-page").disabled = currentPage === 1;
	    document.getElementById("next-slot-page").disabled = currentPage * rowsPerPage >= parkingSlots.length;
	    document.getElementById("current-slot-page").textContent = currentPage;
	}
	
	//add slot section
	addSlotForm.addEventListener("submit", async (event) => {
	    event.preventDefault();

	    const category = document.getElementById("slotcategory").value;
	    const section = document.getElementById("slotSection").value;
	    const slotNumber = document.getElementById("slotNumber").value.trim();
	    const slotStatus = document.getElementById("slotStatus").value;

	    // Check if a duplicate exists
	    const isDuplicate = parkingSlots.some(
	        (slot) => slot.category === category && slot.section === section && slot.slotNumber === slotNumber
	    );

	    if (isDuplicate && !currentSlotId) {
	        alert("This parking slot already exists. Please enter a different slot.");
	        return;
	    }

	    const payload = { category, section, slotNumber, status: slotStatus };

	    try {
	        let url = "http://localhost:8080/api/parking-slots";
	        let method = "POST";

	        if (currentSlotId) { // If modifying a slot
	            url = `${url}/${currentSlotId}`;
	            method = "PUT";
	            payload.id = currentSlotId; // Ensure the ID is included
	        }

	        const response = await fetch(url, {
	            method: method,
	            headers: { "Content-Type": "application/json" },
	            body: JSON.stringify(payload),
	        });

			if (!response.ok) throw new Error(`Error: ${response.status}`);
	        alert(currentSlotId ? "Parking slot modified successfully!" : "Parking slot added successfully!");

	        // Reset form fields
	        addSlotForm.reset();
	        currentSlotId = null;

	        // Close modal properly
	        $('#addSlotModal').modal('hide');

	        // Refresh the parking slots dynamically
	        await fetchParkingSlots();

	    } catch (error) {
	        console.error(currentSlotId ? "Error modifying parking slot:" : "Error adding parking slot:", error);
	        alert("Unable to add or modify parking slot.");
	    }
	});

	

//modify parking slot
	parkingSlotTable.addEventListener("click", (event) => {
	    if (event.target.classList.contains("modify-btn")) {
	        const id = event.target.dataset.id;
	        const category = event.target.dataset.slotcategory;
	        const section = event.target.dataset.slotSection;
	        const slotNumber = event.target.dataset.slotNumber;
	        const status = event.target.dataset.status;

	        // Open Modal
			$('#addSlotModal').modal('show');

	        // Populate fields
	        document.getElementById("slotcategory").value = category;
	        document.getElementById("slotSection").value = section;
	        document.getElementById("slotNumber").value = slotNumber;
	        document.getElementById("slotStatus").value = status;

	        // Store the slot ID for updating
	        currentSlotId = id; 
	    }
	});
	
	// Delete Parking Slot
		parkingSlotTable.addEventListener("click", async (event) => {
		    if (event.target.classList.contains("delete-btn")) {
		        const id = event.target.dataset.id;

		        // Confirm delete action
		        const confirmDelete = confirm("Are you sure you want to delete this parking slot?");
		        if (!confirmDelete) return;

		        try {
		            const response = await fetch(`http://localhost:8080/api/parking-slots/${id}`, {
		                method: "DELETE",
		            });

		            if (!response.ok) throw new Error(`Error: ${response.status}`);

		            // Remove the slot from the `parkingSlots` array
		            parkingSlots = parkingSlots.filter((slot) => String(slot.id) !== id);

		            // Re-render the table immediately to reflect the updated data
		            renderTable();

		            alert("Parking slot deleted successfully!");
		        } catch (error) {
		            console.error("Error deleting parking slot:", error);
		            alert("Unable to delete parking slot.");
		        }
		    }
		});


    // Pagination Controls
    document.getElementById("prev-slot-page").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable(); 
        }
    });

    document.getElementById("next-slot-page").addEventListener("click", () => {
        if (currentPage * rowsPerPage < parkingSlots.length) {
            currentPage++;
            renderTable(); 
        }
    });

    // Fetch Total Parking Slots (for the dashboard card)
    async function fetchTotalParkingSlots() {
        try {
            const response = await fetch("http://localhost:8080/api/parking-slots/count");
            if (!response.ok) {
                throw new Error("Failed to fetch parking slot count");
            }
            const totalSlots = await response.json();
            document.querySelector(".card.green h2").textContent = totalSlots;
        } catch (error) {
            console.error("Error fetching total parking slots:", error);
        }
    }
	// Fetch Total Parking Slots (for the dashboard card)
	    async function fetchTotalParkingSlots() {
	        try {
	            const response = await fetch("http://localhost:8080/api/parking-slots/count");
	            if (!response.ok) {
	                throw new Error("Failed to fetch parking slot count");
	            }
	            const totalSlots = await response.json();
	            document.querySelector(".card.green h2").textContent = totalSlots;
	        } catch (error) {
	            console.error("Error fetching total parking slots:", error);
	        }
	    }
		fetchTotalParkingSlots(); 
    fetchParkingSlots(); 
    
});
