function hideAllSections() {
    const sections = document.querySelectorAll(
        "#cards-section, #booking-table-section, #parking-slot-section, #user-management-section"
    );
    sections.forEach((section) => {
        section.style.display = "none"; // Hide all sections
    });
}
