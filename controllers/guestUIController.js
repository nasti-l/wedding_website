let groups = [];
let primaryGroup = null;
let groupColors = {};
let selectedGroups = new Set(); // Track selected groups

// Fetch groups from the backend
const loadGroups = async () => {
  const response = await fetch("/api/guests/groups");
  groups = await response.json();
  groupColors = Object.fromEntries(groups.map(g => [g.name, g.color]));
  updateGroupDisplay();
};

// Function to add a group
const addGroup = async () => {
  const groupInput = document.getElementById("groupInput");
  const groupName = groupInput.value.trim();

  if (!groupName) {
    alert("Please enter a group name.");
    return;
  }

  const response = await fetch("/api/guests/groups", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: groupName }),
  });

  const newGroup = await response.json();
  groups.push(newGroup);
  groupColors[newGroup.name] = newGroup.color;
  primaryGroup = primaryGroup || newGroup.name;
  updateGroupDisplay();
};

// Toggle group selection
const toggleGroup = (groupName) => {
  if (selectedGroups.has(groupName)) {
    selectedGroups.delete(groupName);
    if (primaryGroup === groupName) primaryGroup = selectedGroups.size > 0 ? [...selectedGroups][0] : null;
  } else {
    selectedGroups.add(groupName);
    if (!primaryGroup) primaryGroup = groupName;
  }
  updateGroupDisplay();
};

// Update the group display in the UI
const updateGroupDisplay = () => {
  const groupsContainer = document.getElementById("groupsContainer");
  groupsContainer.innerHTML = "";

  groups.forEach(group => {
    const tag = document.createElement("span");
    const isSelected = selectedGroups.has(group.name);
    tag.className = `group-tag ${group.name === primaryGroup ? 'primary' : ''} ${isSelected ? 'selected' : ''}`;
    tag.style.backgroundColor = group.color;
    tag.textContent = group.name;
    tag.onclick = () => toggleGroup(group.name);
    groupsContainer.appendChild(tag);
  });
};

// Modified renderGuestList
const renderGuestList = async () => {
  const response = await fetch('/api/guests');
  const guests = await response.json();

  const guestList = document.getElementById("guestList");
  guestList.innerHTML = "";

  guests.forEach(guest => {
    const primaryGroupId = guest.primary_group_id;
    const primaryGroupObj = guest.groups.find(g => g.id === primaryGroupId);
    const primaryGroupName = primaryGroupObj ? primaryGroupObj.name : "";

    const groupNames = guest.groups.map(g => g.name);
    const sortedGroupNames = primaryGroupName ?
        [primaryGroupName, ...groupNames.filter(g => g !== primaryGroupName)] :
        groupNames;

    const groupHTML = sortedGroupNames.map(groupName => {
      const groupObj = guest.groups.find(g => g.name === groupName);
      const color = groupObj ? groupObj.color : "#CCCCCC";
      const isPrimary = groupName === primaryGroupName ? 'primary-group-tag' : '';
      return `<span class="group-tag ${isPrimary}" style="background-color: ${color};">${groupName}</span>`;
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

// Handle form submission for adding guests
document.getElementById("guestForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!name || !phone) {
    alert("Please fill in all required fields");
    return;
  }

  if (selectedGroups.size === 0) {
    alert("Please select at least one group");
    return;
  }

  const groupIds = groups.filter(g => selectedGroups.has(g.name)).map(g => g.id);
  const primaryGroupObj = groups.find(g => g.name === primaryGroup);
  const primaryGroupId = primaryGroupObj ? primaryGroupObj.id : groupIds[0];

  try {
    const response = await fetch("/api/guests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        groupIds,
        primaryGroupId
      }),
    });

    const result = await response.json();

    if (response.ok) {
      document.getElementById("result").textContent = "Guest added successfully!";
      document.getElementById("name").value = "";
      document.getElementById("phone").value = "";
      selectedGroups.clear(); // Clear selections after successful add
      primaryGroup = null;
      updateGroupDisplay();
      renderGuestList();
    } else {
      document.getElementById("result").textContent = `Error: ${result.error}`;
      document.getElementById("result").className = "text-danger mt-3";
    }
  } catch (error) {
    console.error("Error adding guest:", error);
    document.getElementById("result").textContent = "Failed to add guest";
  }
});

// Function to delete a guest
const deleteGuest = async (id) => {
  if (!confirm("Are you sure you want to delete this guest?")) return;

  try {
    const response = await fetch(`/api/guests/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      renderGuestList();
    } else {
      const result = await response.json();
      alert(`Error: ${result.error}`);
    }
  } catch (error) {
    console.error("Error deleting guest:", error);
    alert("Failed to delete guest");
  }
};

// Load data when page loads
window.onload = () => {
  loadGroups();
  renderGuestList();
};