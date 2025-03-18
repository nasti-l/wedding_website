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

const groupColors = {}; // Store unique colors for each group

const getGroupColor = (group) => {
  if (!groupColors[group]) {
    // Generate a pastel color
    const hue = Math.random() * 360;
    groupColors[group] = `hsl(${hue}, 70%, 70%)`;
  }
  return groupColors[group];
};

const getTransparentColor = (color) => {
  return color.replace('hsl', 'hsla').replace(')', ', 0.15)');
};

const renderGuestList = async () => {
  const response = await fetch('/api/guests');
  const guests = await response.json();

  const guestList = document.getElementById("guestList");
  guestList.innerHTML = ""; // Clear the list before re-rendering

  guests.forEach(guest => {
    const primaryGroup = guest.primaryGroup;
    const groups = guest.groups;

    // Move primary group to the first position
    const sortedGroups = [primaryGroup, ...groups.filter(g => g !== primaryGroup)];

    const groupHTML = sortedGroups.map(group => {
      const color = getGroupColor(group);
      const isPrimary = group === primaryGroup ? 'primary-group-tag' : '';

      // Use the color for primary groups too, not transparent
      return `<span class="group-tag ${isPrimary}" style="background-color: ${color};">${group}</span>`;
    }).join(" ");

    const row = document.createElement("tr");
    row.innerHTML = `        
      <td>${guest.id}</td>
      <td>${guest.name}</td>
      <td>${guest.phone}</td>
      <td>${groupHTML}</td>
      <td>${guest.status}</td>
      <td><button class="delete-btn" onclick="deleteGuest(${guest.id})">Delete</button></td>
    `;
    guestList.appendChild(row);
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
  const resultElement = document.getElementById("result");
  resultElement.textContent = result.message;

  document.getElementById("guestForm").reset();
  groups.length = 0;
  primaryGroup = null;
  updateGroupDisplay();

  renderGuestList(); // Refresh the table after adding a guest
});


// Load the guest list when the page loads
window.onload = renderGuestList;

