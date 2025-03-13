// Define groups and primary group
const groups = [];
let primaryGroup = null;

// Function to add a group
function addGroup() {
  const groupInput = document.getElementById("groupInput");
  const groupValue = groupInput.value.trim();

  if (!groupValue) {
    alert("Please enter a group name.");
    return;
  }

  // Prevent duplicates
  if (groups.includes(groupValue)) {
    alert("This group is already added.");
    return;
  }

  groups.push(groupValue); // Add group to list
  primaryGroup = primaryGroup || groupValue; // Set first group as primary
  updateGroupDisplay();
  groupInput.value = ""; // Clear input
}

// Function to update the group display
function updateGroupDisplay() {
  const groupsContainer = document.getElementById("groupsContainer");
  groupsContainer.innerHTML = ""; // Clear display

  groups.forEach((group) => {
    const groupTag = document.createElement("div");
    groupTag.className = "group-tag";
    groupTag.dataset.tooltip = "Set as primary"; // Tooltip text
    if (group === primaryGroup) groupTag.classList.add("primary");

    groupTag.textContent = group;

    // Set as primary on click
    groupTag.onclick = () => {
      primaryGroup = group;
      updateGroupDisplay();
    };

    // Add delete button inside tag
    const removeIcon = document.createElement("span");
    removeIcon.textContent = "x";
    removeIcon.onclick = (e) => {
      e.stopPropagation(); // Prevent primary toggle
      groups.splice(groups.indexOf(group), 1);
      if (primaryGroup === group) primaryGroup = null; // Clear primary if removed
      updateGroupDisplay();
    };

    groupTag.appendChild(removeIcon);
    groupsContainer.appendChild(groupTag);
  });
}

const renderGuestList = async () => {
  const response = await fetch('/api/guests'); // Replace with your actual endpoint
  const guests = await response.json();

  const tableBody = document.getElementById("guestList"); // Replace with your table's ID
  tableBody.innerHTML = ""; // Clear existing rows

  guests.forEach(guest => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${guest.id}</td>
      <td>${guest.name}</td>
      <td>${guest.phone}</td>
      <td>${guest.groups.join(", ")}</td>
      <td>${guest.status}</td>
      <td><button onclick="deleteGuest(${guest.id})">Delete</button></td>
    `;
    tableBody.appendChild(row);
  });
};

const deleteGuest = async (id) => {
  await fetch(`/api/guests/${id}`, { method: 'DELETE' });
  renderGuestList(); // Refresh the list after deletion
};



document.getElementById("guestForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;

  if (groups.length === 0) {
    alert("At least one group is required.");
    return;
  }

  const guest = { name, phone, groups, primaryGroup, status: "Not Invited" };

  const response = await fetch('/api/guests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(guest)
  });

  const result = await response.json();
  console.log("Guest added:", result);

  document.getElementById("guestForm").reset();
  groups.length = 0;
  primaryGroup = null;
  updateGroupDisplay();

  renderGuestList(); // Refresh the table after adding a guest
});


// Load the guest list when the page loads
window.onload = renderGuestList;

