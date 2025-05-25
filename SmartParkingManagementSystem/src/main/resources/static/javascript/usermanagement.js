document.addEventListener("DOMContentLoaded", () => {
    const userManagementLink = document.getElementById("user-management-link");
    const userManagementSection = document.getElementById("user-management-section");
    const parkingslotlink = document.getElementById("parking-slot-link");
    const parkingslotsection = document.getElementById("parking-slot-section");
    const bookingtablesection = document.getElementById("booking-table-section");
    const cardsSection = document.getElementById("cards-section");
    const userTableBody = document.getElementById("userTable").getElementsByTagName("tbody")[0];

	const prevButton = document.getElementById("user-prev-page");
	const nextButton = document.getElementById("user-next-page");
	const currentPageDisplay = document.getElementById("user-current-page");

    let users = []; // Array to store fetched users
    let currentPage = 1; // Current page
    const rowsPerPage = 4; // Number of rows per page

    // Show User Management Section and Fetch User Data
    userManagementLink.addEventListener("click", () => {
        userManagementSection.style.display = "block"; // Show User Management Section
        if (cardsSection) cardsSection.style.display = "none"; // Hide Dashboard Cards
        if (parkingslotsection) parkingslotsection.style.display = "none"; // Hide Parking Slot Section
        if (bookingtablesection) bookingtablesection.style.display = "none"; // Hide Booking Table Section

        fetchUserData(); // Fetch user data and populate the table
    });

    // Fetch User Data from the Server
    async function fetchUserData() {
        try {
            const response = await fetch("http://localhost:8080/api/users-management/users");
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            users = await response.json(); // Store fetched users
            currentPage = 1; // Reset to the first page
            renderTable(); // Render the table
        } catch (error) {
            console.error("Error fetching user data:", error);
            alert("Failed to load user data.");
        }
    }

    // Render the Table Rows Based on Current Page
    function renderTable() {
        userTableBody.innerHTML = ""; // Clear existing rows

		const startIndex = (currentPage - 1) * rowsPerPage;
		const endIndex = startIndex + rowsPerPage;
		const currentUsers = users.slice(startIndex, endIndex);

        // Populate Table Rows with Current Page Data
        currentUsers.forEach((user) => {
            const row = userTableBody.insertRow();
            row.innerHTML = `
                <td>${user.fullName}</td>
                <td>${user.phoneNumber}</td>
                <td>${user.email}</td>
                <td>${user.vehicleType}</td>
                <td>${user.vehicleNumber}</td>
                <td><button class="delete-btn" data-email="${user.email}">Delete</button></td>
            `;
        });

        // Add Event Listeners to Delete Buttons
        const deleteButtons = document.querySelectorAll(".delete-btn");
        deleteButtons.forEach(button => {
            button.addEventListener("click", async (event) => {
                const email = event.target.getAttribute("data-email");
                await deleteUserByEmail(email);
            });
        });

        // Enable/Disable Pagination Buttons
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage * rowsPerPage >= users.length;

        // Update Current Page Display
        currentPageDisplay.textContent = currentPage;
    }

    // Pagination Controls
    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable(); // Render the previous page
        }
    });

	nextButton.addEventListener("click", () => {
	    console.log(`Next button clicked. Current Page: ${currentPage}`);
	    if (currentPage * rowsPerPage < users.length) { // Check if more rows exist
	        currentPage++;
	        console.log(`Navigating to Page: ${currentPage}`);
	        renderTable();
	    } else {
	        console.log("No more pages to display.");
	    }
	});


    // Delete a User by Email
    async function deleteUserByEmail(email) {
        try {
            const response = await fetch(`http://localhost:8080/api/users-management/users/${email}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('User deleted successfully');
                // Remove the deleted user from the array
                users = users.filter(user => user.email !== email);
                renderTable(); // Refresh the table
            } else {
                alert('Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('An error occurred while deleting the user.');
        }
    }

    // Fetch Total Vehicles (for Dashboard)
    async function fetchTotalVehicles() {
        try {
            const response = await fetch("http://localhost:8080/api/users-management/total-vehicles");
            if (!response.ok) throw new Error(`Error: ${response.status}`);
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
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            const totalVehicleOwners = await response.json();
            document.querySelector(".card.teal h2").textContent = totalVehicleOwners;
        } catch (error) {
            console.error("Error fetching total vehicle owners:", error);
        }
    }

    // Fetch Data on Page Load
    fetchTotalVehicles();
    fetchTotalVehicleOwners();
});
